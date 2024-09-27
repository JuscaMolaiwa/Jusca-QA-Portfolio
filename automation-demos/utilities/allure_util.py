import subprocess  # For running shell commands

def generate_allure_report():
    # Generate Allure report from results
    subprocess.run(["allure", "generate", "allure-results", "-o", "allure-report"])