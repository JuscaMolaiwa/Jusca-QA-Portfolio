import logging
import os

def setup_logging(log_file="test_log.log"):
    log_directory = "automation-logs"  # Specify your log directory
    if not os.path.exists(log_directory):
        os.makedirs(log_directory)
    
    log_file_path = os.path.join(log_directory, log_file)
    logging.basicConfig(filename=log_file_path, level=logging.INFO,
                        format="%(asctime)s:%(levelname)s:%(message)s")
    
    return os.path.abspath(log_file_path)  # Return the absolute path to the log file
