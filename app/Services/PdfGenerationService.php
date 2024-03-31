<?php

namespace App\Services;

use PDF;
use App\Models\User;

class PdfGenerationService
{
    public function generatePdf()
    {
        $output = 'large_data_' . time();
        $stream = fopen(storage_path("app/public/{$output}.pdf"), 'w');

        fwrite($stream, $this->pdfHeader());

        User::query()->chunk(1000, function ($data) use ($stream) {
            foreach ($data as $item) {
                fwrite($stream, $this->pdfRow($item));
            }
        });

        fclose($stream);
        // Download the PDF file
        return response()->download(storage_path("app/public/{$output}.pdf"));
    }

    private function pdfHeader()
    {
        return "<!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <title>Large Data PDF</title>
                    <style>
                        /* Define your styles for PDF here */
                    </style>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>";
    }

    private function pdfRow($item)
    {
        return "<tr>
                    <td>{$item->id}</td>
                    <td>{$item->email}</td>
                    <td>{$item->email}</td>
                </tr>";
    }
}
