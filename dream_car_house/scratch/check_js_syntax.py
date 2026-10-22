# Test app.js and data.js for syntax errors or bracket mismatches
for filename in ['js/data.js', 'js/app.js']:
    with open(filename, 'r', encoding='utf-8') as f:
        code = f.read()
    
    # check bracket counts
    braces = code.count('{') - code.count('}')
    brackets = code.count('[') - code.count(']')
    parens = code.count('(') - code.count(')')
    print(f"{filename}: braces diff={braces}, brackets diff={brackets}, parens diff={parens}")
