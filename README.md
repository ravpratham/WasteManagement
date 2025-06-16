# Dynamic Excel Dashboard

A powerful and interactive web-based dashboard application built with Dash and Plotly that allows users to visualize and analyze Excel data dynamically.

## Features

- 📊 Dynamic Excel file upload and processing
- 📈 Interactive bar charts and histograms
- 🔍 Dynamic filtering capabilities
- 📋 Data summary metrics
- 📑 Interactive data table view
- 🎯 Customizable X and Y axis selection
- 📱 Responsive design

<img src="screenshot.png"/>

## Prerequisites

- Python 3.x
- Required Python packages:
  - dash
  - pandas
  - plotly
  - openpyxl (for Excel file support)

## Installation

1. Clone the repository or download the source code
2. Install the required packages:
```bash
pip install dash pandas plotly openpyxl
```

## Usage

1. Run the dashboard:
```bash
python dashboard.py
```

2. Open your web browser and navigate to `http://127.0.0.1:8050/`

3. Upload an Excel file (.xlsx or .xls) using the upload interface

4. Use the interface to:
   - Select X and Y axis columns for visualization
   - Apply filters to your data
   - View summary metrics
   - Interact with the generated charts
   - Explore the data table

## Features in Detail

### File Upload
- Supports .xlsx and .xls file formats
- Drag and drop or click to upload interface
- Automatic data parsing and validation

### Dynamic Filters
- Automatically generates filters based on categorical columns
- Multi-select capability for each filter
- Real-time data filtering

### Visualization
- Interactive bar charts and histograms
- Automatic axis scaling for numeric data
- Customizable X and Y axis selection
- Real-time updates based on filter selections

### Data Summary
- Total row count
- Average values for numeric columns
- Interactive data table with all filtered data

## Technical Details

The dashboard is built using:
- Dash for the web framework
- Plotly for interactive visualizations
- Pandas for data manipulation
- Base64 for file handling

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License. 