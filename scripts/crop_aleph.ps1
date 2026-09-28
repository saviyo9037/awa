Add-Type -AssemblyName System.Drawing
$imgPath = "d:\D3innovatives\pr\pr\web\public\workflow-mockup.jpg"
$outPath = "d:\D3innovatives\pr\pr\web\public\flower_snow_winter.jpg"

$src = [System.Drawing.Bitmap]::FromFile($imgPath)
$w = $src.Width
$h = $src.Height

# Aleph image container coordinates in the 1920x1080 screenshot
$cropX = [int]($w * 0.793)
$cropY = [int]($h * 0.315)
$cropW = [int]($w * 0.163)
$cropH = [int]($h * 0.335)

$rect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
$cropped = $src.Clone($rect, $src.PixelFormat)
$cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$src.Dispose()
$cropped.Dispose()
Write-Host "Crop completed successfully: $outPath"
