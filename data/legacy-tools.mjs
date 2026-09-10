// Historical tool registry preserved from the pre-1009 Zero Trust build.
// These routes remain first-class tools and are merged with the 1009-tool catalog.
const raw=`pdf-merger|PDF Merger|pdf
pdf-compressor|PDF Compressor|pdf
pdf-to-jpg|PDF to JPG|pdf
jpg-to-pdf|JPG to PDF|pdf
pdf-splitter|PDF Splitter|pdf
image-compressor|Image Compressor|image
image-resizer|Image Resizer|image
image-cropper|Image Cropper|image
qr-generator|QR Code Generator|qr
qr-scanner|QR Code Scanner|qr
password-generator|Password Generator|security
json-formatter|JSON Formatter & Validator|developer
word-counter|Word Counter|text
character-counter|Character Counter|text
age-calculator|Age Calculator|calculator
percentage-calculator|Percentage Calculator|calculator
emi-calculator|EMI Calculator|calculator
gst-calculator|GST Calculator|calculator
unit-converter|Unit Converter|calculator
uuid-generator|UUID Generator|security
base64|Base64 Encoder|developer
base64-decoder|Base64 Decoder|developer
hash-generator|Hash Generator|security
text-diff-checker|Text Diff Checker|text
case-converter|Case Converter|text
remove-duplicate-lines|Remove Duplicate Lines|text
url-encoder-decoder|URL Encoder/Decoder|developer
image-format-converter|Image Format Converter|image
exif-remover|EXIF/Metadata Remover|privacy
secure-random-generator|Secure Random Generator|security
pdf-page-extractor|PDF Page Extractor|pdf
pdf-page-deleter|PDF Page Deleter|pdf
pdf-page-reorderer|PDF Page Reorderer|pdf
pdf-rotate|PDF Rotate|pdf
pdf-watermark|PDF Watermark|pdf
pdf-grayscale|PDF Grayscale|pdf
pdf-text-extractor|PDF Text Extractor|pdf
pdf-image-extractor|PDF Image Extractor|pdf
pdf-metadata-viewer|PDF Metadata Viewer|pdf
pdf-metadata-remover|PDF Metadata Remover|pdf
pdf-password-protector|PDF Password Protector|pdf
pdf-permission-inspector|PDF Permission Inspector|pdf
pdf-to-png|PDF to PNG|pdf
pdf-to-webp|PDF to WebP|pdf
pdf-to-text|PDF to Text|pdf
images-to-pdf|Images to PDF|pdf
png-to-pdf|PNG to PDF|pdf
webp-to-pdf|WebP to PDF|pdf
html-to-pdf|HTML to PDF|pdf
markdown-to-pdf|Markdown to PDF|pdf
text-to-pdf|Text to PDF|pdf
pdf-page-numbering|PDF Page Numbering|pdf
pdf-booklet-maker|PDF Booklet Maker|pdf
pdf-contact-sheet|PDF Contact Sheet|pdf
pdf-size-analyzer|PDF Size Analyzer|pdf
jpg-to-png|JPG to PNG|image
png-to-jpg|PNG to JPG|image
jpg-to-webp|JPG to WebP|image
png-to-webp|PNG to WebP|image
webp-to-jpg|WebP to JPG|image
webp-to-png|WebP to PNG|image
gif-to-png|GIF to PNG|image
image-rotate|Image Rotate|image
image-flip|Image Flip|image
image-grayscale|Image Grayscale|image
image-brightness|Image Brightness|image
image-contrast|Image Contrast|image
image-sharpen|Image Sharpen|image
image-blur|Image Blur|image
image-pixelate|Image Pixelate|image
image-crop-by-ratio|Image Crop by Ratio|image
image-crop-by-pixels|Image Crop by Pixels|image
image-dpi-calculator|Image DPI Calculator|image
image-dimensions-checker|Image Dimensions Checker|image
image-color-picker|Image Color Picker|image
sentence-counter|Sentence Counter|text
paragraph-counter|Paragraph Counter|text
reading-time-calculator|Reading Time Calculator|text
text-reverser|Text Reverser|text
text-sorter|Text Sorter|text
text-deduplicator|Text Deduplicator|text
empty-line-remover|Empty-Line Remover|text
extra-space-remover|Extra-Space Remover|text
whitespace-cleaner|Whitespace Cleaner|text
line-counter|Line Counter|text
word-frequency-counter|Word Frequency Counter|text
text-extractor|Text Extractor|text
slug-generator|Slug Generator|text
lorem-ipsum-generator|Lorem Ipsum Generator|text
text-to-ascii|Text to ASCII|developer
ascii-to-text|ASCII to Text|developer
unicode-inspector|Unicode Inspector|developer
unicode-converter|Unicode Converter|developer
text-normalizer|Text Normalizer|text
text-compare|Text Compare|text
wifi-qr-generator|Wi-Fi QR Generator|qr
vcard-qr-generator|vCard QR Generator|qr
email-qr-generator|Email QR Generator|qr
sms-qr-generator|SMS QR Generator|qr
url-qr-generator|URL QR Generator|qr
pdf-page-duplicate|Duplicate PDF Pages|pdf
pdf-page-insert-blank|Insert Blank PDF Pages|pdf
pdf-page-delete-range|Delete PDF Page Range|pdf
pdf-page-reverse|Reverse PDF Page Order|pdf
pdf-page-alternate|Alternate Two PDFs|pdf
pdf-interleave|Interleave PDF Pages|pdf
pdf-page-copy|Copy Pages Between PDFs|pdf
pdf-page-extract-range|Extract PDF Page Range|pdf
pdf-page-extract-even|Extract Even PDF Pages|pdf
pdf-page-extract-odd|Extract Odd PDF Pages|pdf
pdf-page-extract-first|Extract First PDF Page|pdf
pdf-page-extract-last|Extract Last PDF Page|pdf
pdf-page-count|PDF Page Count|pdf
pdf-file-size|PDF File Size Analyzer|pdf
pdf-page-size|PDF Page Size Analyzer|pdf
pdf-page-dimensions|PDF Page Dimensions|pdf
pdf-orientation|PDF Orientation Checker|pdf
pdf-landscape|Convert Pages to Landscape|pdf
pdf-portrait|Convert Pages to Portrait|pdf
pdf-page-scale|Scale PDF Pages|pdf
pdf-page-margin|Add PDF Page Margins|pdf
pdf-page-crop|Crop PDF Pages|pdf
pdf-page-center|Center PDF Page Content|pdf
pdf-page-fit-a4|Fit PDF Pages to A4|pdf
pdf-page-fit-letter|Fit PDF Pages to Letter|pdf
pdf-page-fit-a3|Fit PDF Pages to A3|pdf
pdf-page-fit-legal|Fit PDF Pages to Legal|pdf
pdf-page-fit-11x17|Fit PDF Pages to 11x17|pdf
pdf-page-rotate-90|Rotate PDF Pages 90°|pdf
pdf-page-rotate-180|Rotate PDF Pages 180°|pdf
pdf-page-rotate-270|Rotate PDF Pages 270°|pdf
pdf-page-rotate-left|Rotate PDF Pages Left|pdf
pdf-page-rotate-right|Rotate PDF Pages Right|pdf
pdf-page-flatten|Flatten PDF Forms|pdf
pdf-page-cleanup|Clean PDF Metadata|pdf
pdf-title-editor|Edit PDF Title|pdf
pdf-author-editor|Edit PDF Author|pdf
pdf-subject-editor|Edit PDF Subject|pdf
pdf-keywords-editor|Edit PDF Keywords|pdf
pdf-creator-editor|Edit PDF Creator|pdf
pdf-producer-editor|Edit PDF Producer|pdf
pdf-metadata-reset|Reset PDF Metadata|pdf
pdf-metadata-export|Export PDF Metadata|pdf
pdf-metadata-json|PDF Metadata to JSON|pdf
pdf-inspector|PDF Inspector|pdf
pdf-structure-inspector|PDF Structure Inspector|pdf
pdf-font-inspector|PDF Font Inspector|pdf
pdf-annotation-inspector|PDF Annotation Inspector|pdf
pdf-form-inspector|PDF Form Inspector|pdf
pdf-image-count|PDF Image Count|pdf
pdf-blank-page-finder|Find Blank PDF Pages|pdf
pdf-duplicate-page-finder|Find Duplicate PDF Pages|pdf
pdf-page-labeler|Label PDF Pages|pdf
pdf-page-number-overlay|Overlay Page Numbers|pdf
pdf-page-number-header|Add Page Numbers to Header|pdf
pdf-page-number-footer|Add Page Numbers to Footer|pdf
pdf-page-number-roman|Add Roman Page Numbers|pdf
pdf-page-number-arabic|Add Arabic Page Numbers|pdf
pdf-page-number-custom|Add Custom Page Labels|pdf
pdf-header-footer|Add PDF Header & Footer|pdf
pdf-text-watermark|Add PDF Text Watermark|pdf
pdf-image-watermark|Add PDF Image Watermark|pdf
pdf-diagonal-watermark|Add Diagonal PDF Watermark|pdf
pdf-stamp|Stamp PDF Pages|pdf
pdf-draft-stamp|Stamp PDF Draft|pdf
pdf-confidential-stamp|Stamp PDF Confidential|pdf
pdf-approved-stamp|Stamp PDF Approved|pdf
pdf-date-stamp|Stamp PDF Date|pdf
pdf-bates-numbering|PDF Bates Numbering|pdf
pdf-page-checksum|PDF Page Checksums|pdf
pdf-document-checksum|PDF Document Checksum|pdf
pdf-split-every-page|Split PDF Every Page|pdf
pdf-split-every-n-pages|Split PDF Every N Pages|pdf
pdf-split-by-size|Split PDF by Approximate Size|pdf
pdf-merge-folder-order|Merge PDFs in Selection Order|pdf
pdf-merge-bookmarks|Merge PDFs with Document Info|pdf
pdf-append-pdf|Append PDF|pdf
pdf-prepend-pdf|Prepend PDF|pdf
pdf-combine-selected|Combine Selected PDF Pages|pdf
pdf-remove-annotations|Remove PDF Annotations|pdf
pdf-remove-javascript|Remove PDF JavaScript|pdf
pdf-optimize|Optimize PDF Structure|pdf
pdf-linearize-check|Check PDF Web Optimization|pdf
pdf-version-check|Check PDF Version|pdf
pdf-encryption-check|Check PDF Encryption|pdf
pdf-permission-check|Check PDF Permissions|pdf
pdf-page-preview|Generate PDF Page Preview|pdf
pdf-contact-sheet-compact|Compact PDF Contact Sheet|pdf
pdf-contact-sheet-portrait|Portrait PDF Contact Sheet|pdf
pdf-contact-sheet-landscape|Landscape PDF Contact Sheet|pdf
pdf-to-png-all|Convert PDF Pages to PNG|pdf
pdf-to-jpeg-all|Convert PDF Pages to JPEG|pdf
pdf-to-webp-all|Convert PDF Pages to WebP|pdf
pdf-extract-images|Extract Images from PDF|pdf
pdf-extract-text-all|Extract All PDF Text|pdf
pdf-text-search|Search Text in PDF|pdf
pdf-text-report|Create PDF Text Report|pdf
pdf-page-report|Create PDF Page Report|pdf
pdf-document-report|Create PDF Document Report|pdf
pdf-duplicate-cleaner|Remove Duplicate PDF Pages|pdf`;
export const LEGACY_TOOLS=raw.split('\n').filter(Boolean).map(x=>{const [slug,name,category]=x.split('|');return{slug,name,category,categoryName:category,phase:1,engine:category==='pdf'?'pdf':category==='image'||category==='privacy'?'image':category==='qr'?'qr':category==='security'?'security':category==='developer'?'developer':category==='text'?'text':category==='calculator'?'calculator':'general',legacy:true}});
if(LEGACY_TOOLS.length!==200)throw new Error(`Legacy registry integrity failure: ${LEGACY_TOOLS.length}`);
