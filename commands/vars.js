module.exports = {
  name:        'vars',
  description: 'Demo session variables',
  code: `
$var[score; 100]
$var[name;  $username]
Name:    $getVar[name]
Score:   $getVar[score]
Unknown: $getVar[missing; default_value]
  `.trim(),
};
