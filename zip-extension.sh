#!/bin/bash

# Di chuyển đến thư mục của dự án
cd /Volumes/Data/Code/fptu-exam-to-calendar

# Tạo file zip với tên có version, đảm bảo bao gồm tất cả icon
zip -r fptu-examination.zip manifest.json background.js popup.html popup.js popup.css content.js sanitize-utils.js icon-16.png icon-48.png icon-128.png -x "*.DS_Store" "*.git*" 
