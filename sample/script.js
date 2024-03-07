class FirebaseUploadAdapter {
	constructor(loader) {
	  // The file loader instance to use during the upload.
	  this.loader = loader;
	  // Initialize uploadTask to null
	  this.uploadTask = null;
	}
  
	// Starts the upload process.
	upload() {
	  return this.loader.file
		.then(file => new Promise((resolve, reject) => {
		  const storageRef = firebase.storage().ref();
		  // Assign the upload task to this.uploadTask so it can be referenced later.
		  this.uploadTask = storageRef.child('images/' + file.name).put(file);
  
		  this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
			(snapshot) => {
			  // Upload progress handling can go here, if needed.
			},
			(error) => {
			  reject(error);
			},
			() => {
			  this.uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
				resolve({
				  default: downloadURL
				});
			  });
			}
		  );
		}));
	}
  
	// Aborts the upload process.
	abort() {
	  // Check if the upload task exists and is running, then cancel it.
	  if (this.uploadTask && this.uploadTask.snapshot.state === firebase.storage.TaskState.RUNNING) {
		this.uploadTask.cancel();
	  }
	}
  }
  
  



  function CustomUploadAdapterPlugin(editor) {
	editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
	  // Configure the URL to the upload script in your back-end here!
	  return new FirebaseUploadAdapter(loader);
	};
  }




const watchdog = new CKSource.EditorWatchdog();

window.watchdog = watchdog;

watchdog.setCreator( ( element, config ) => {
	return CKSource.Editor
		.create( element, config )
		.then( editor => {
			return editor;
		} );
} );

watchdog.setDestructor( editor => {
	return editor.destroy();
} );

watchdog.on( 'error', handleSampleError );

watchdog
	.create( document.querySelector( '.editor' ), {

	
		extraPlugins: [CustomUploadAdapterPlugin],

	
		language: 'ar',
		// https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
		toolbar: {
			items: [
				//'exportPDF','exportWord', '|',
				'findAndReplace', 'selectAll', '|',
				'heading', '|',
				'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', '|',
				'bulletedList', 'numberedList', 'todoList', '|',
				'outdent', 'indent', '|',
				'undo', 'redo',
				//'-',
				'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
				'alignment', '|',
				'link', 'insertImage', 'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', 'htmlEmbed', '|',
				'specialCharacters', 'horizontalLine', 'pageBreak', '|',
				'textPartLanguage', '|',
				'sourceEditing'
			],
			shouldNotGroupWhenFull: false
		},

		// ckfinder: {
        //     // Upload the images to the server using the CKFinder QuickUpload command.
        //     uploadUrl: 'https://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json',
		// 	openerMethod: 'popup',
		// 	 // Define the CKFinder configuration (if necessary).
		// 	 options: {
        //         resourceType: 'Images'
        //     }
        // },
		ui: { 
	poweredBy: {
		position: 'inside',
		side: 'left',
		label: ''
	},},

		toolbarLocation: 'bottom',
		// Changing the language of the interface requires loading the language file using the <script> tag.
		// language: 'es',
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true
			}
		},
		// https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
		heading: {
			options: [
				{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
				{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
				{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
				{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
				{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
				{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
				{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
			]
		},
		// https://ckeditor.com/docs/ckeditor5/latest/features/editor-placeholder.html#using-the-editor-configuration
		placeholder: 'Type here ...',
		// https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
		fontFamily: {
			options: [
				'default',
				'Arial, Helvetica, sans-serif',
				'Courier New, Courier, monospace',
				'Georgia, serif',
				'Lucida Sans Unicode, Lucida Grande, sans-serif',
				'Tahoma, Geneva, sans-serif',
				'Times New Roman, Times, serif',
				'Trebuchet MS, Helvetica, sans-serif',
				'Verdana, Geneva, sans-serif'
			],
			supportAllValues: true
		},
		// https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
		fontSize: {
			options: [ 10, 12, 14, 'default', 18, 20, 22 ],
			supportAllValues: true
		},
		// Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
		// https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
		htmlSupport: {
			allow: [
				{
					name: /.*/,
					attributes: true,
					classes: true,
					styles: true
				}
			]
		},
		// Be careful with enabling previews
		// https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
		htmlEmbed: {
			showPreviews: true
		},
		// https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
		link: {
			decorators: {
				addTargetToExternalLinks: true,
				defaultProtocol: 'https://',
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file'
					}
				}
			}
		},
		// https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
		mention: {
			feeds: [
				{
					marker: '@',
					feed: [
						'@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
						'@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
						'@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
						'@sugar', '@sweet', '@topping', '@wafer'
					],
					minimumCharacters: 1
				}
			]
		},
		simpleUpload: {
            // The URL that the images are uploaded to.
            uploadUrl: 'http://example.com',

            // Enable the XMLHttpRequest.withCredentials property.
            withCredentials: true,

            // Headers sent along with the XMLHttpRequest to the upload server.
            headers: {
                'X-CSRF-TOKEN': 'CSRF-Token',
                Authorization: 'Bearer <JSON Web Token>'
            }
        }
		// The "super-build" contains more premium features that require additional configuration, disable them below.
		// Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
		// removePlugins: [
		// 	// These two are commercial, but you can try them out without registering to a trial.
		// 	// 'ExportPdf',
		// 	// 'ExportWord',
		// 	'AIAssistant',
		// 	'CKBox',
		// 	'CKFinder',
		// 	'EasyImage',
		// 	// This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
		// 	// https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
		// 	// Storing images as Base64 is usually a very bad idea.
		// 	// Replace it on production website with other solutions:
		// 	// https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
		// 	// 'Base64UploadAdapter',
		// 	'RealTimeCollaborativeComments',
		// 	'RealTimeCollaborativeTrackChanges',
		// 	'RealTimeCollaborativeRevisionHistory',
		// 	'PresenceList',
		// 	'Comments',
		// 	'TrackChanges',
		// 	'TrackChangesData',
		// 	'RevisionHistory',
		// 	'Pagination',
		// 	'WProofreader',
		// 	// Careful, with the Mathtype plugin CKEditor will not load when loading this sample
		// 	// from a local file system (file://) - load this site via HTTP server if you enable MathType.
		// 	'MathType',
		// 	// The following features are part of the Productivity Pack and require additional license.
		// 	'SlashCommand',
		// 	'Template',
		// 	'DocumentOutline',
		// 	'FormatPainter',
		// 	'TableOfContents',
		// 	'PasteFromOfficeEnhanced'
		// ]
	} ).then(editor=>{
		window.integrationScope.setData2=(val)=>{
		  if(window.integrationScope.getData()!==editor.getData())
			editor.setData(val);
		}
	editor.model.document.on( 'change:data', (e) => {
	  window.integrationScope.setData(editor.getData());
	});
	editor.setData(window.integrationScope.getData());
  })
	.catch( handleSampleError );

function handleSampleError( error ) {
	const issueUrl = 'https://github.com/ckeditor/ckeditor5/issues';

	const message = [
		'Oops, something went wrong!',
		`Please, report the following error on ${ issueUrl } with the build id "lk6cexpsq23l-8ibnkmslrxwe" and the error stack trace:`
	].join( '\n' );

	console.error( message );
	console.error( error );
}


