# BlobServer
Near real-time remote audio captured, adapted to microphone input, converted to 
WAV files and uploaded to Azure blob storage

The client is built to run on Yocto Linux, but it will run anywhere Node can run.
Just install your own node modules using 'npm install <module name>.
The server is built to run on Windows 8.1 or Azure.

Copy all the code to each platform, set the client's environment variables (see below), 
and run 'node server.js' on both platforms. The server, whether you run it locally or not, 
does not need these environment variables set.

Client must have these environment variables set as follows:

export CLIENT=true

export development=true

When you set this variable to 'true', your files will be committed to your local Azure blob storage.
If you remove the variable or set it to 'false', the files will be uploaded to your Azure account's
blob storage.  Read-up on how to setup your Azure environment.

Optionally, you may want to set DEBUG to generate debug data to the console as follows:

export DEBUG=*  (on Linux)
set DEBUG=*     (on Windows)

