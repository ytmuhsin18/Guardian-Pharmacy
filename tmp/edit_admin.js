import fs from 'fs';
const filePath = 'c:\\Users\\muhsi\\OneDrive\\Documents\\Guardian Pharma APP\\src\\pages\\AdminDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = '<option value="Maternity Care">Maternity Care</option>';
const replacement = target + '\n                                                     <option value="Surgical Products">Surgical Products</option>\n                                                     <option value="Physiotherapy">Physiotherapy</option>';

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Success");
} else {
    console.log("Target not found");
}
