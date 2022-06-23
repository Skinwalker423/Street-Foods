const CampGround = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxClient = require('@mapbox/mapbox-sdk');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MY_ACCESS_TOKEN;


const baseClient = mbxClient({ accessToken: mapboxToken });
const geocodingClient = mbxGeocoding(baseClient);


module.exports.index =  async (req, res) => {
    const camps = await CampGround.find({});
    res.render('campgrounds/index', {camps});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createNewCampground = async (req, res) => {
    const formData = req.body;
    const newCamp = new CampGround(formData);
    const geoData = await geocodingClient.forwardGeocode({
        query: newCamp.location,
        limit: 1
    }).send();
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(image => {
        return {url: image.path, filename: image.filename}
    })
    newCamp.author = req.user._id;
    await newCamp.save();
    console.log(newCamp);
    req.flash('success', 'Successfully created a new campground!')
    res.redirect(`campgrounds/${newCamp._id}`);
}

module.exports.showCampground = async(req, res) => {
    const {id} = req.params;
    const foundCamp = await CampGround.findById(id).populate([{path:'reviews', populate: { path: 'username'}}, 'author']);
    if(!foundCamp){
        req.flash('error', 'Cannot find campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {foundCamp});
    }

module.exports.renderEditForm =  async (req, res) => {
    const {id} = req.params;
    const foundCamp = await CampGround.findById(id);
    if(!foundCamp){
        req.flash('error', 'Cannot find campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {foundCamp});
    }

module.exports.editCampground = async (req, res) => {
    const {id} = req.params;
    const editFormData = req.body;
    const updatedCamp = await CampGround.findByIdAndUpdate(id, editFormData);
    const newImages = req.files.map(img => ({url: img.path, filename: img.filename}));
    updatedCamp.images.push(...newImages);
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCamp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    await updatedCamp.save();
    req.flash('success', 'Successfully edited your campground!');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.destroyCampground = async (req, res) => {
    const {id} = req.params;
    const deleteItem = await CampGround.findById(id);
    if(deleteItem.images){
        for(let image of deleteItem.images){
            await cloudinary.uploader.destroy(image.filename);
        }
    }
    await CampGround.findByIdAndDelete(id);

    // there is a middleware that removes the reviews from MongoDB post findByOneAndDelete

    req.flash('success', 'Successfully deleted your campground!');
    res.redirect('/campgrounds')
}

