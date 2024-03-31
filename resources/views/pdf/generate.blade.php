<!-- resources/views/pdf/generate.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate PDF</title>
    <style>
        /* Define loader styles */
        .loader {
            border: 16px solid #f3f3f3;
            border-radius: 50%;
            border-top: 16px solid #3498db;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
            margin: auto;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loader-container {
            display: none;
            position: fixed;
            z-index: 9999;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.7);
        }
    </style>
</head>
<body>
    <div class="loader-container" id="loaderContainer">
        <div class="loader"></div>
    </div>

    <button id="generatePdfButton">Generate PDF</button>

    <script>
        document.getElementById('generatePdfButton').addEventListener('click', function() {
            document.getElementById('loaderContainer').style.display = 'block';

            // Make an AJAX request to generate the PDF
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        // PDF generation completed, hide the loader
                        document.getElementById('loaderContainer').style.display = 'none';
                    }
                }
            };
            xhr.open('GET', '{{ route("generatePdf") }}');
            xhr.send();
        });
    </script>
</body>
</html>
