set release 6.3.289
set url https://github.com/mozilla/pdf.js/releases/download/v$release/pdfjs-$release-dist.zip
set dir static/pdf.js

rm --recursive $dir
mkdir --parents $dir

curl --fail --location $url | bsdtar --extract --file - --directory $dir
or exit 1

rg --files-with-matches 'compressed\.tracemonkey-pldi-09\.pdf' $dir | while read --local file
    sed --in-place 's|compressed\.tracemonkey-pldi-09\.pdf||g' $file
end

sed --in-place 's|</head>|<link rel="stylesheet" href="/viewer.css"></head>|' $dir/web/viewer.html
