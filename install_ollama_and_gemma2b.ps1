# Ollama & Gemma 2B Setup Script for Windows
# Save this as install_ollama_and_gemma2b.ps1 and run in PowerShell as Administrator

#Open PowerShell as Administrator:

#1.Click Start, type powershell, right-click "Windows PowerShell", and select "Run as administrator".
#2.Navigate to your project folder:
#cd "C:\Users\L00172489\Downloads\Final-Year-Project"
#3.Run the script: .\install_ollama_and_gemma2b.ps1




# Download and install Ollama
Write-Host "Downloading and installing Ollama..."
Invoke-WebRequest -Uri "https://ollama.com/download/OllamaSetup.exe" -OutFile "$env:TEMP\OllamaSetup.exe"
Start-Process "$env:TEMP\OllamaSetup.exe" -Wait

# Add Ollama to PATH if needed (user may need to restart shell)

# Start Ollama service
Write-Host "Starting Ollama service..."
Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden
Start-Sleep -Seconds 5

# Pull the Gemma 2B model
Write-Host "Pulling gemma2:2b model..."
ollama pull gemma2:2b

Write-Host "Ollama and Gemma 2B model are ready!"
