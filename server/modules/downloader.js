const download = require('image-downloader');

exports.saveImages = function (imgurl,callback) {
    
    let options = {
        url: imgurl ,
        dest: `./tmp_images/${ new Date().valueOf() }.jpg`
      };
  
      download.image(options).then(({ filename, image }) => {
  
        callback(filename);
  
      }).catch((err) => {
  
        throw err
  
      })

};