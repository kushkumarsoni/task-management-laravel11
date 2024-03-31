<?php

namespace App\Jobs;

use App\Models\User;
use PDF;
use Illuminate\Bus\Queueable;
use App\Services\PdfGenerationService;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class GeneratePdfJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $output = 'large_data_' . time();
        $filePath = storage_path("app/public/{$output}.pdf");

        $dataQuery = User::query(); // Replace YourModel with your actual model

        $dataQuery->chunk(1000, function ($data) use ($filePath) {
            $pdf = PDF::loadView('pdf.large_data', compact('data'));

            if (file_exists($filePath)) {
                $pdf->setOption('append', true);
            }

            $pdf->save($filePath);
        });

        return response()->download(storage_path("app/public/{$output}.pdf"));
    }
}
