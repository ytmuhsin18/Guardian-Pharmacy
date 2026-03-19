import sys

file_path = r'c:\Users\muhsi\OneDrive\Documents\Guardian Pharma APP\src\pages\AdminDashboard.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '<option value="Maternity Care">Maternity Care</option>'
replacement = target + '\n                                                     <option value="Surgical Products">Surgical Products</option>\n                                                     <option value="Physiotherapy">Physiotherapy</option>'

if target in content:
    new_content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Success")
else:
    print("Target not found")
