define(function(require, exports, module) {
	var juicer = require("juicer");

	require("modules/widget/jquery.imgareaselect");

	var alertify = require("alertify");

	var AjaxForm = require("ajaxform");

	var Dialog = require("dialog");

	var UploadDialog = Backbone.View.extend({
		template : function() {
			return '<div>' +

					'<div class="fan-image-upload-init" id="fan_image_upload">' +
					'<form enctype="multipart/form-data" method="POST" action="http://image.yinyuetai.com/edit">' +
					'<input type="hidden" name="redirect" value="">' +
					'<input type="hidden" name="fid" value="">' +
					'<input type="hidden" name="cmd" value="" >' +
					'<a href="javascript:void(0)" class="fan-add-icons fan-dialog-link-input">' +
					'<input name="img" class="ico_ct_release" type="file" />{{buttonText}}' +
					'</a>' +
					'<p class="fan-image-upload-tip">{{{imageTip}}}</p>' +
					'</form>' +
					'</div>' +
					'<div class="fan-loading fan-dialog-image-loading" id="fan_image_upload_loading"></div>' +
					'<div class="fan-image-area-select" id="fan_image_area">' +
					'<div class="fan-image-original"><img src="" /></div>' +
					'<div class="fan-image-original-line"></div>' +
					'<div class="fan-image-scale"><img src="" /></div>' +
					'<a href="javascript:void(0)" class="fan-add-icons fan-dialog-link">重选头像</a>' +
					'<p class="fan-image-upload-tip">{{{imageTip}}}</p>' +
					'<form enctype="multipart/form-data" method="POST" action="http://image.yinyuetai.com/edit">' +
					'<input type="hidden" name="redirect" value="">' +
					'<input type="hidden" name="fid" value="">' +
					'<input type="hidden" name="cmd" value="" >' +
					'<input type="submit" class="ico_ct_release fan-image-area-submit" value="上传" />' +
					'</form>' +
					'<div class="fan-loading fan-dialog-scale-loading"></div>' +
					'</div>' +

					'</div>';
		},
		show : function(config) {
			var self = this;
			this.config = config || {};
			this.dialog = new Dialog(juicer(this.template(), this.config), {
				title : this.config.title || '图片上传',
				width : 406,
				height : 300,
				isAutoShow : true,
				onShow : function() {
					self.initUpload();
				},
				onHide : function() {
					self.destroy();
				}
			});
			this.dialogCloseButton = this.dialog.$(".J_close");
		},
		initUpload : function() {
			this.bindUploadElements();
			this.setUploadData();
			this.bindFormBehavior();
		},
		bindUploadElements : function() {
			var ctn = $("#fan_image_upload");
			this.uploadArea = {
				ctn : ctn,
				form : ctn.find("form"),
				redirectInput : ctn.find("input[name=redirect]"),
				fidInput : ctn.find("input[name=fid]"),
				cmdInput : ctn.find("input[name=cmd]"),
				loading : $("#fan_image_upload_loading")
			};
		},
		setUploadData : function() {
			this.uploadArea.fidInput.val(this.config.fid);
			this.uploadArea.cmdInput.val(this.config.cmd);
			this.uploadArea.redirectInput.val(this.config.redirectUrl);
		},
		bindFormBehavior : function() {
			var self = this;
			new AjaxForm(this.uploadArea.form, {
				onComplete : function(result) {
					var result = result || {};
					if (self.config.imgAreaSelect) {
						self.uploadArea.loading.hide();
						self.dialogCloseButton.show();
						if (!result.error) {
							self.initImgAreaSelect(result.images[0]);
						} else {
							alertify.error(result.message);
							self.uploadArea.ctn.show();
						}
						return;
					}

					self.config.complete && self.config.complete(result);
					if (!result.error) {
						alertify.success(result.message || "图片上传成功！");
					} else {
						alertify.error(result.message || "图片上传失败！");
					}
					self.destroy();

				}
			});

			this.uploadArea.form.find("input[type=file]").on("change", function() {
				if ($(this).val() !== "") {
					self.uploadArea.form[0].submit();
					self.uploadArea.ctn.hide();
					self.uploadArea.loading.show();
					self.dialogCloseButton.hide();
				}
			});
		},
		initImgAreaSelect : function(image) {
			this.bindImgAreaElements();
			this.bindImgAreaEvents();
			this.bindImgAreaData(image);

			this.imgArea.originalImg.attr("src", image.path);
			this.imgArea.scaleImg.attr("src", image.path);

			this.setOriginalImageScaleSize();
			this.setOriginalImageSizesAndPosition();

			this.initSelectionPlugin();

			this.imgArea.ctn.show();

			this.initImgAreaSubmitForm();
		},
		bindImgAreaElements : function() {
			var ctn = $("#fan_image_area");
			this.imgArea = {
				ctn : ctn,
				originalArea : ctn.find(".fan-image-original"),
				originalImg : ctn.find("img").eq(0),
				scaleArea : ctn.find(".fan-image-scale"),
				scaleImg : ctn.find("img").eq(1),
				backButton : ctn.find(".fan-dialog-link"),
				submitButton : ctn.find(".fan-image-area-submit"),
				loadingArea : ctn.find(".fan-dialog-scale-loading"),
				form : ctn.find("form"),
				redirectInput : ctn.find("input[name=redirect]"),
				fidInput : ctn.find("input[name=fid]"),
				cmdInput : ctn.find("input[name=cmd]")
			};
		},
		bindImgAreaEvents : function() {
			var self = this;
			this.imgArea.backButton.on("click", function() {
				self.destroy();
				self.show(self.configBak);
			});
		},
		bindImgAreaData : function(image) {
			this.imgAreaData = {
				ready : false,
				image : image,
				original : {
					size : {
						width : this.imgArea.originalArea.innerWidth(),
						height : this.imgArea.originalArea.innerHeight()
					},
					scale : 1,
					scaleSize : {
						width : image.width,
						height : image.height
					}
				}
			};
			this.imgArea.redirectInput.val(Y.domains.urlStatic + "/fanhome/change-avatar");
			this.imgArea.fidInput.val(this.config.fid);
			this.config.originalImgSrc = image.path;
			this.config.originalImgName = image.path.substring(image.path.lastIndexOf("/") + 1, image.path.lastIndexOf("_"));
		},
		//处理服务器返回的图片尺寸，使之适合区域的尺寸
		setOriginalImageScaleSize : function() {
			var image = this.imgAreaData.image,
					max = Math.max(image.width, image.height),
					originalSize = this.imgAreaData.original.size.width;
			if (max > originalSize) {
				if (image.width >= image.height) {
					this.imgAreaData.original.scale = originalSize / image.width;
					this.imgAreaData.original.scaleSize.height = Math.round(image.height * this.imgAreaData.original.scale);
					this.imgAreaData.original.scaleSize.width = originalSize;
					return;
				}

				this.imgAreaData.original.scale = originalSize / image.height;
				this.imgAreaData.original.scaleSize.width = Math.round(image.width * this.imgAreaData.original.scale);
				this.imgAreaData.original.scaleSize.height = originalSize;
			}
		},
		setOriginalImageSizesAndPosition : function() {
			var originalSize = this.imgAreaData.original.size.width;
			this.imgArea.originalImg.css($.extend(this.imgAreaData.original.scaleSize, {
				marginTop : (originalSize - this.imgAreaData.original.scaleSize.height) / 2,
				marginLeft : (originalSize - this.imgAreaData.original.scaleSize.width) / 2
			}));
		},
		initSelectionPlugin : function() {
			var self = this;
			this.imgAreaSelect = this.imgArea.originalImg.imgAreaSelect({
				handles : true,
				aspectRatio : "1:1",
				instance : true,
				onInit : function() {
					self.setDefaultSelection();
					self.imgAreaData.ready = true;
				},
				onSelectChange : function(img, selection) {
					self.previewScaleImg(selection);
				},
				onSelectEnd : function(img, selection) {
					self.updateSelectionData(selection);
				}
			});
		},
		setDefaultSelection : function() {
			//设置选择框居中
			var isTransverse = (this.imgAreaData.original.scaleSize.width >= this.imgAreaData.original.scaleSize.height),
					x1 = isTransverse ?
							Math.round((this.imgAreaData.original.scaleSize.width - this.imgAreaData.original.scaleSize.height) / 2) : 0,
					y1 = isTransverse ? 0 :
							Math.round((this.imgAreaData.original.scaleSize.height - this.imgAreaData.original.scaleSize.width) / 2),
					x2 = isTransverse ? this.imgAreaData.original.scaleSize.height + x1 : this.imgAreaData.original.scaleSize.width,
					y2 = isTransverse ? this.imgAreaData.original.scaleSize.height : this.imgAreaData.original.scaleSize.width + y1;
			this.imgAreaSelect.setSelection(x1, y1, x2, y2);
			this.imgAreaSelect.setOptions({show : true});
			this.imgAreaSelect.update();

			var defalutSelection = {
				x1 : x1,
				y1 : y1,
				width : isTransverse ? this.imgAreaData.original.scaleSize.height : this.imgAreaData.original.scaleSize.width,
				height : isTransverse ? this.imgAreaData.original.scaleSize.height : this.imgAreaData.original.scaleSize.width
			};
			this.previewScaleImg(defalutSelection);
			this.updateSelectionData(defalutSelection);
		},
		previewScaleImg : function(selection) {
			var scaleX = this.imgArea.scaleArea.innerWidth() / (selection.width || 1);
			var scaleY = this.imgArea.scaleArea.innerHeight() / (selection.height || 1);
			this.imgArea.scaleImg.css({
				width : Math.round(scaleX * this.imgAreaData.original.scaleSize.width) + 'px',
				height : Math.round(scaleY * this.imgAreaData.original.scaleSize.height) + 'px',
				marginLeft : '-' + Math.round(scaleX * selection.x1) + 'px',
				marginTop : '-' + Math.round(scaleY * selection.y1) + 'px'
			});
		},
		updateSelectionData : function(selection) {
			var data = {
				x1 : Math.round(selection.x1 / this.imgAreaData.original.scale),
				y1 : Math.round(selection.y1 / this.imgAreaData.original.scale),
				width : Math.round(selection.width / this.imgAreaData.original.scale),
				height : Math.round(selection.height / this.imgAreaData.original.scale)
			};
			this.imgArea.cmdInput.val('[{"point": "+' + data.x1 + '+' + data.y1 + '", "srcImg":"' + this.config.originalImgSrc +
					'", "op":"crop", "size":"' + data.width + 'x' + data.height +
					'"},{"sizes":"180x180,66x66", "op":"scale", "uniform":1, "zoomUp":0},{"saveOriginal":0, "op":"save","overlayName" : "' +
					this.config.originalImgName + '", "plan":"fanAvatar", "belongId":' + this.config.fid + '}]');
		},
		initImgAreaSubmitForm : function() {
			var self = this;
			new AjaxForm(this.imgArea.form, {
				onRequest : function() {
					if (!self.imgAreaData.ready) {
						alertify.error("请先选择裁切区域！");
						return false;
					}
					self.imgArea.submitButton.hide();
					self.imgArea.backButton.css("visibility", "hidden");
					self.imgArea.loadingArea.show();
					self.dialogCloseButton.hide();
					return true;
				},
				onComplete : function(result) {
					self.processServerSelection(result);
				}
			});
		},
		processServerSelection : function(result) {
			this.config.complete && this.config.complete(result);
			if (!result) {
				this.saveSelectionFail({});
				return;
			}
			if (!result.error) {
				alertify.success(result.message || "图片上传成功！");
				this.destroy();
				return;
			}
			this.saveSelectionFail(result);
		},
		saveSelectionFail : function(result) {
			this.dialogCloseButton.show();
			this.imgArea.backButton.css("visibility", "visible");
			this.imgArea.loadingArea.hide();
			this.imgArea.submitButton.show();
			alertify.error(result.message || "图片上传失败！");
		},
		destroy : function() {
			this.dialog.destroy();
			this.imgAreaSelect && this.imgAreaSelect.remove();
		}
	});

	var uploadDialog = new UploadDialog();

	module.exports = {
		show : function(config) {
			uploadDialog.configBak = config;
			uploadDialog.show(config);
		}
	};
});