const cloudinary = require('cloudinary').v2;

const imageUploader = (imageBuffer)=>{
    
    // Making an async call to upload the image
    return new Promise((resolve, reject) => {

        // Using the upload_stream provided by cloudinary
        const stream = cloudinary.uploader.upload_stream(

            // Storing the image in the blog_images folder
            { folder: 'blog_images' },

            (error, result) => {
                if(error) {
                    // Handling error if any occurs
                    return reject(error)
                }

                // Returns the url of the uploaded image
                resolve(result.secure_url)
            }
        );

        // Sending the image buffer for the upload
        stream.end(imageBuffer)
    })
}

module.exports = imageUploader