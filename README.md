# 🛡️ Log Copilot - SOC Analyst Dashboard

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fakhurdin/Log-Copilot-SOC-Analyst-Dashboard)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)  
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

A **privacy-first, AI-powered SOC analyst dashboard** for advanced log analysis, anomaly detection, IOC extraction, and MITRE ATT&CK mapping. All processing happens **locally in your browser** — no data leaves your device.  

**Live Demo:** [https://log-copilot-soc-analyst-dashboard-w.vercel.app/](https://log-copilot-soc-analyst-dashboard-w.vercel.app/)

---

## 🌟 Features

- **🔒 100% Privacy-First:** Local analysis, no external data sharing  
- **🤖 AI-Powered Analysis:** Anomaly detection using ML models  
- **🔍 IOC Extraction:** Identify and classify indicators of compromise  
- **🎯 MITRE ATT&CK Mapping:** Map suspicious activity to attack techniques  
- **📊 Reports:** Export findings in PDF or Markdown  
- **⚡ Real-time Processing:** Live progress during analysis  
- **📱 Responsive Design:** Works on desktop and mobile  
- **🎨 Modern UI:** Professional, security-focused interface  

---

## 📋 Supported Log Formats

| Format | Description | Example |
|--------|-------------|---------|
| **Sysmon** | Windows system monitoring events | Process creation, network connections |
| **Zeek** | Network monitoring logs | DNS, HTTP, connection logs |
| **Windows Events** | Standard Windows logs | Security, system, application events |
| **AWS CloudTrail** | AWS API/service logs | API calls, events |
| **Generic CSV/TSV** | Any structured log | Custom log formats |

---

## 🚀 Quick Start

### 1️⃣ Online (Recommended)
1. Visit the [Live Demo](https://log-copilot-soc-analyst-dashboard-w.vercel.app/)  
2. Click **Try with Sample Logs**  
3. Upload your own logs (CSV, JSON, TSV, TXT)  

### 2️⃣ Local Development

```bash
# Clone the repo
git clone https://github.com/fakhurdin/Log-Copilot-SOC-Analyst-Dashboard.git
cd Log-Copilot-SOC-Analyst-Dashboard

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:8080 in your browser


### Option 3: Windows Quick Start
1. Download the repository
2. Double-click `start.bat`
3. Wait for the application to start
4. Open your browser to the displayed URL

## 📊 How to Use

### 1. Upload Logs
- Drag and drop your security log files (CSV, JSON, TSV, TXT)
- Multiple files can be uploaded simultaneously
- Maximum file size: 50MB per file

### 2. Try Sample Data
- Click "Try with Sample Logs" on the home page
- Pre-configured sample data for testing
- Works offline - no external dependencies

### 3. View Analysis
- **Analysis Tab**: Overview of findings, anomalies, and statistics
- **IOCs Tab**: Extracted indicators of compromise with confidence scores
- **MITRE Tab**: ATT&CK technique mappings and coverage
- **Export Tab**: Generate reports in PDF or Markdown format

### 4. Export Results
- Download comprehensive analysis reports
- Export IOCs for threat hunting
- All exports generated locally

## 🔧 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS, Shadcn/ui
- **Charts**: Recharts for data visualization
- **AI/ML**: TensorFlow.js for anomaly detection
- **File Processing**: PapaParse for CSV parsing
- **PDF Generation**: jsPDF for report export
- **Deployment**: Vercel

## 🛡️ Privacy & Security

- **100% Client-Side**: All processing happens in your browser
- **No Data Transmission**: Your logs never leave your device
- **Local Storage**: Only theme preferences stored locally
- **No Registration**: No accounts or personal data required
- **Open Source**: Transparent code for security review

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── tabs/           # Main application tabs
│   └── ...
├── utils/              # Core analysis utilities
│   ├── logProcessor.ts # Main log processing logic
│   ├── iocExtractor.ts # IOC extraction algorithms
│   ├── mitreMapper.ts  # MITRE ATT&CK mapping
│   └── ...
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fakhurdin/Log-Copilot-SOC-Analyst-Dashboard)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Deploy automatically

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to your preferred platform
# The built files are in the 'dist' directory
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/Log-Copilot-SOC-Analyst-Dashboard.git
cd Log-Copilot-SOC-Analyst-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint
```

### Areas for Contribution

- **New Log Formats**: Add support for additional log types
- **Enhanced Analysis**: Improve anomaly detection algorithms
- **UI/UX Improvements**: Better user experience and accessibility
- **Documentation**: Improve guides and examples
- **Testing**: Add comprehensive test coverage

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Fakhur Ul Din** - Cybersecurity Specialist & SOC Analyst

- 🌐 **Website**: [LinkedIn](https://www.linkedin.com/in/fakhur-ul-din-b8902421b)
- 💻 **GitHub**: [@fakhurdin](https://github.com/fakhurdin)
- 📧 **Email**: fakhurdin987@gmail.com

## 🙏 Acknowledgments

- **MITRE ATT&CK Framework** for threat intelligence
- **Zeek Network Security Monitor** for network analysis
- **Microsoft Sysmon** for system monitoring
- **The cybersecurity community** for inspiration and feedback

## 📈 Roadmap

- [ ] **Advanced ML Models**: Enhanced anomaly detection
- [ ] **Real-time Streaming**: Live log analysis
- [ ] **Collaborative Features**: Team analysis capabilities
- [ ] **API Integration**: Connect with SIEM systems
- [ ] **Mobile App**: Native mobile application
- [ ] **Plugin System**: Extensible architecture

## 🐛 Troubleshooting

See our [Troubleshooting Guide](TROUBLESHOOTING.md) for common issues and solutions.

## 📞 Support

- **Documentation**: Check the troubleshooting guide
- **Issues**: [GitHub Issues](https://github.com/fakhurdin/Log-Copilot-SOC-Analyst-Dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/fakhurdin/Log-Copilot-SOC-Analyst-Dashboard/discussions)

---

**⭐ Star this repository if you find it helpful!**

**🔒 Built with ❤️ for the cybersecurity community**
