# utilities/video_util.py
import subprocess
import os

def start_video_recording(output_file="test_run.mp4", display=":99"):
    # Ensure the output directory exists
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)

    command = [
        "ffmpeg", "-y", "-video_size", "1920x1080", "-f", "x11grab", 
        "-i", f"{display}", "-r", "30", output_file
    ]

    try:
        process = subprocess.Popen(command)
        print(f"Recording started: {output_file}")
        return process
    except Exception as e:
        print(f"Error starting video recording: {e}")
        return None

def stop_video_recording(process):
    if process is not None:
        process.terminate()
        print("Recording stopped.")
    else:
        print("No recording process to stop.")
