# Troubleshooting Guide

## Common Issues and Solutions

### 1. Page Not Loading

**Symptoms**: Blank page or "Cannot connect" error

**Solutions**:
- Ensure you're running `npm run dev` and accessing `http://localhost:8080`
- Check if the development server is running (should show "Local: http://localhost:8080/")
- Try refreshing the page
- Check browser console for errors (F12 → Console tab)

### 2. File Upload Issues

**Symptoms**: Files not uploading or processing errors

**Solutions**:
- Verify file format is supported (CSV, JSON, TSV, TXT)
- Check file size (max 50MB per file)
- Ensure file has proper headers matching supported formats
- Try with smaller files first
- Check browser console for specific error messages

### 3. Sample Data Not Working

**Symptoms**: "Try Sample" button doesn't work or shows errors

**Solutions**:
- The sample data is now embedded and should work offline
- If issues persist, try uploading your own log files
- Check browser console for any JavaScript errors
- Ensure all dependencies are installed (`npm install`)

### 4. Build Errors

**Symptoms**: `npm run build` fails or shows errors

**Solutions**:
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Check Node.js version (requires Node.js 16+)
- Ensure you have sufficient disk space

### 5. Styling Issues

**Symptoms**: Page looks broken or unstyled

**Solutions**:
- Clear browser cache and refresh
- Check if Tailwind CSS is loading properly
- Ensure all CSS files are being served
- Try a different browser

### 6. Performance Issues

**Symptoms**: Slow loading or processing

**Solutions**:
- Use smaller log files for testing
- Close other browser tabs
- Check available RAM and CPU usage
- Try processing files one at a time

### 7. Export Issues

**Symptoms**: PDF or Markdown export fails

**Solutions**:
- Ensure you have analysis results to export
- Check browser console for errors
- Try refreshing the page and re-analyzing
- Ensure browser allows downloads

## Browser Compatibility

**Supported Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Not Supported**:
- Internet Explorer
- Older browser versions

## System Requirements

**Minimum Requirements**:
- Node.js 16.0 or higher
- 4GB RAM
- 1GB free disk space
- Modern web browser

**Recommended**:
- Node.js 18.0 or higher
- 8GB RAM
- 2GB free disk space
- Chrome or Firefox

## Getting Help

If you're still experiencing issues:

1. **Check the browser console** (F12 → Console) for error messages
2. **Review the README.md** for setup instructions
3. **Try the sample data** to verify the application works
4. **Check your log file format** matches the supported formats
5. **Restart the development server** (`Ctrl+C` then `npm run dev`)

## Development Mode vs Production

**Development Mode** (`npm run dev`):
- Hot reloading enabled
- More detailed error messages
- Slower performance
- Better for debugging

**Production Mode** (`npm run build` then `npm run preview`):
- Optimized performance
- Minified code
- Better for testing final version

## Log File Format Examples

### Valid Sysmon Format:
```csv
TimeGenerated,Computer,EventID,Image,CommandLine,User,ProcessId,ParentImage,ParentCommandLine,Hashes
2024-01-15 10:30:15,WORKSTATION-01,1,C:\Windows\System32\powershell.exe,powershell.exe -Command "whoami",DOMAIN\user1,1234,C:\Windows\explorer.exe,C:\Windows\Explorer.EXE,SHA256=A1B2C3D4E5F6
```

### Valid Zeek DNS Format:
```csv
timestamp,uid,id.orig_h,id.orig_p,id.resp_h,id.resp_p,proto,trans_id,rtt,query,qclass,qclass_name,qtype,qtype_name,rcode,rcode_name,AA,TC,RD,RA,Z,answers,TTLs,rejected
1692360000.123456,CjOgHd3zy8QZy5QaKd,192.168.1.100,54321,8.8.8.8,53,udp,15423,0.025,google.com,1,C_INTERNET,1,A,0,NOERROR,F,F,T,T,0,142.250.185.14,300,F
```

## Still Need Help?

If none of these solutions work, please:
1. Note the exact error message
2. Include your browser and version
3. Include your Node.js version (`node --version`)
4. Describe the steps that led to the issue
