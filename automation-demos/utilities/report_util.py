# utilities/report_util.py
import logging
import os

def setup_logging(log_file="test_log.log"):
    logging.basicConfig(filename=log_file, level=logging.INFO,
                        format="%(asctime)s:%(levelname)s:%(message)s")
    return os.path.abspath(log_file)  # Return the absolute path to the log file

