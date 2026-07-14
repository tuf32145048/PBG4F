param(
  [string]$OutputPath = (Join-Path (Split-Path -Parent $PSScriptRoot) "public\og-image.png")
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$outputDirectory = Split-Path -Parent $OutputPath
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

$bitmap = [System.Drawing.Bitmap]::new($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$background = $null
$gridPen = $null
$accentBrush = $null
$panelBrush = $null
$panelPen = $null
$badgeFont = $null
$titleFont = $null
$subtitleFont = $null
$labelFont = $null
$darkBrush = $null
$lightBrush = $null
$mutedBrush = $null
$labelBrush = $null
$centerFormat = $null

try {
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $canvas = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
  $background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $canvas,
    [System.Drawing.ColorTranslator]::FromHtml("#172033"),
    [System.Drawing.ColorTranslator]::FromHtml("#2a384e"),
    24
  )
  $graphics.FillRectangle($background, $canvas)

  $gridPen = [System.Drawing.Pen]::new(
    [System.Drawing.Color]::FromArgb(20, 255, 255, 255),
    1
  )
  for ($x = 0; $x -le $width; $x += 48) {
    $graphics.DrawLine($gridPen, $x, 0, $x, $height)
  }
  for ($y = 0; $y -le $height; $y += 48) {
    $graphics.DrawLine($gridPen, 0, $y, $width, $y)
  }

  $accentBrush = [System.Drawing.SolidBrush]::new(
    [System.Drawing.ColorTranslator]::FromHtml("#f1b84b")
  )
  $graphics.FillRectangle($accentBrush, 0, 0, 18, $height)
  $graphics.FillEllipse($accentBrush, 936, -130, 390, 390)

  $panelBrush = [System.Drawing.SolidBrush]::new(
    [System.Drawing.Color]::FromArgb(238, 23, 32, 51)
  )
  $panelPen = [System.Drawing.Pen]::new(
    [System.Drawing.Color]::FromArgb(75, 255, 255, 255),
    2
  )
  $graphics.FillRectangle($panelBrush, 72, 64, 1056, 502)
  $graphics.DrawRectangle($panelPen, 72, 64, 1056, 502)

  $graphics.FillRectangle($accentBrush, 112, 104, 112, 112)
  $badgeFont = [System.Drawing.Font]::new(
    "Georgia",
    42,
    [System.Drawing.FontStyle]::Bold,
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $darkBrush = [System.Drawing.SolidBrush]::new(
    [System.Drawing.ColorTranslator]::FromHtml("#172033")
  )
  $centerFormat = [System.Drawing.StringFormat]::new()
  $centerFormat.Alignment = [System.Drawing.StringAlignment]::Center
  $centerFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
  $graphics.DrawString(
    "Py",
    $badgeFont,
    $darkBrush,
    [System.Drawing.RectangleF]::new(112, 104, 112, 112),
    $centerFormat
  )

  $labelFont = [System.Drawing.Font]::new(
    "Segoe UI",
    20,
    [System.Drawing.FontStyle]::Bold,
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $labelBrush = [System.Drawing.SolidBrush]::new(
    [System.Drawing.ColorTranslator]::FromHtml("#f1b84b")
  )
  $graphics.DrawString("PYTHON LEARNING GUIDE", $labelFont, $labelBrush, 256, 132)

  $titleFont = [System.Drawing.Font]::new(
    "Segoe UI",
    62,
    [System.Drawing.FontStyle]::Bold,
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $lightBrush = [System.Drawing.SolidBrush]::new(
    [System.Drawing.ColorTranslator]::FromHtml("#f8f4eb")
  )
  $graphics.DrawString("Python Beginner Guide", $titleFont, $lightBrush, 108, 274)

  $subtitleFont = [System.Drawing.Font]::new(
    "Segoe UI",
    27,
    [System.Drawing.FontStyle]::Regular,
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $mutedBrush = [System.Drawing.SolidBrush]::new(
    [System.Drawing.ColorTranslator]::FromHtml("#c9d1dc")
  )
  $graphics.DrawString(
    "Read. Break it down. Write code.",
    $subtitleFont,
    $mutedBrush,
    112,
    374
  )

  $graphics.FillRectangle($accentBrush, 112, 466, 156, 6)
  $graphics.DrawString(
    "A step-by-step introduction to Python fundamentals",
    $labelFont,
    $mutedBrush,
    112,
    494
  )

  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
}
finally {
  @(
    $centerFormat,
    $labelBrush,
    $mutedBrush,
    $lightBrush,
    $darkBrush,
    $labelFont,
    $subtitleFont,
    $titleFont,
    $badgeFont,
    $panelPen,
    $panelBrush,
    $accentBrush,
    $gridPen,
    $background
  ) | Where-Object { $null -ne $_ } | ForEach-Object { $_.Dispose() }
  $graphics.Dispose()
  $bitmap.Dispose()
}
