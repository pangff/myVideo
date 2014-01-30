var querystring = require("querystring"), fs = require("fs"), formidable = require("formidable");
var path = require("path");
var mime = require('mime');
function start(response) {
	console.log("Request handler 'start' was called.");

	var body = '<html>' + '<head>'
			+ '<meta http-equiv="Content-Type" content="text/html; '
			+ 'charset=UTF-8" />' + '</head>' + '<body>'
			+ '<form action="/upload" enctype="multipart/form-data" '
			+ 'method="post">'
			+ '<input type="file" name="upload" multiple="multiple">'
			+ '<input type="submit" value="Upload file" />' + '</form>'
			+ '</body>' + '</html>';

	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}

function upload(response, request) {
	console.log("Request handler 'upload' was called.");
	var form = new formidable.IncomingForm({
		uploadDir : "/tmp"
	});
	console.log("about to parse");
	form
			.parse(
					request,
					function(error, fields, files) {
						console.log("parsing done");
						fs.renameSync(files.upload.path, "/tmp/test.mp4");
						response.writeHead(200, {
							"Content-Type" : "text/html"
						});
						response
								.write("<html>"
										+ "<body>"
										+ "<meta http-equiv='Content-Type' content='text/html;charset=utf-8'>"
										+ "<h1 style='text-align: center'><b>HTML</b></h1>"
										+ "<div id='playercontainer'></div>"
										+ "<script type='text/javascript'"
										+ "src='http://cybertran.baidu.com/cloud/media/assets/cyberplayer/1.0"
										+ "/cyberplayer.min.js'></script>"
										+ "<script type='text/javascript'>"
										+ "var player = cyberplayer('playercontainer').setup({"
										+ "width : 680,"
										+ "height : 400,"
										+ "backcolor : '#FFFFFF',"
										+ "stretching : 'uniform',"
										+ "file : '/show',"
										+ "image : 'http://www.example.com/image/name/snap.jpg',"
										+ "autoStart : true,"
										+ "repeat : 'always',"
										+ "volume : 100,"
										+ "controlbar : 'top',"
										+ "ak:'vPRI2OYEZVunFrD9',"
										+ "sk:'x43W4OQI5bkA2yDd'" + "});"
										+ "</script>" + "    <!--播放器代码结束-->"
										+ "</div>" + "</body>" + "</html>");
						response.end();
					});
}

function show(response) {
	console.log("Request handler 'show' was called.");
//	fs.readFile("/tmp/test.mp4", "binary", function(error, file) {
//		if (error) {
//			response.writeHead(500, {
//				"Content-Type" : "text/plain"
//			});
//			response.write(error + "\n");
//			response.end();
//		} else {
//			var mimetype = mime.lookup(file);
//			response.writeHead(200, {
//				"Content-Type" : mimetype,
//				"Content-Disposition" : 'attachment; filename=aaa.mp4'
//			});
//
//			response.write(file, "binary");
//			response.end();
//		}
//	});
	response.setHeader('Content-disposition', 'attachment; filename=aaa.mp4');
	response.setHeader('Content-type', 'application/x-msdownload'); // for
	response.setHeader('Content-type', 'application/x-rar-compressed'); // for
	var readStream = fs.createReadStream('/tmp/test.mp4');
	readStream.on('open', function() {
		readStream.pipe(response);
	});

	readStream.on('error', function(err) {
		console.log(err);
		response.writeHead(200, {
			'Content-Type' : 'text/html'
		});
		response.end('an error occured', 'utf-8');
	});
}

exports.start = start;
exports.upload = upload;
exports.show = show;