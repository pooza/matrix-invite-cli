#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const minimist = require('minimist');

// Parse arguments
const argv = minimist(process.argv.slice(2), {
  boolean: ['dry-run', 'verbose'],
  alias: {
    d: 'dry-run',
    v: 'verbose'
  }
});

const [username, password, recipientEmail] = argv._;
if (!username || !password || !recipientEmail) {
  console.error('Usage: node invite.js [--dry-run] [--verbose] <username> <password> <email>');
  process.exit(1);
}

// Load config
const configPath = path.join(__dirname, 'config.yaml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
if (argv.verbose) console.log(`✔️ Loaded config from ${configPath}`);

// Load template
const templatePath = path.join(__dirname, 'templates', 'invite.txt');
const templateSrc = fs.readFileSync(templatePath, 'utf8');
const template = Handlebars.compile(templateSrc);
if (argv.verbose) console.log(`✔️ Loaded template from ${templatePath}`);

// Prepare data
const subject = `Matrix アカウント情報: ${username}`
const body = template({
  username,
  password,
  homeserver_url: config.homeserver.url,
  homeserver_domain: (new URL(config.homeserver.url)).hostname,
  element_url: config.element.url,
  element_domain: (new URL(config.element.url)).hostname,
});

// Dry-run mode
if (argv['dry-run']) {
  console.log('⚠️ Dry-run mode enabled. Email will not be sent.');
  console.log('\n----- EMAIL PREVIEW -----\n');
  console.log(`Sbject: ${subject}`);
  console.log(`To: ${recipientEmail}`);
  console.log('');
  console.log(body);
  console.log('\n-------------------------\n');
  process.exit(0);
}

// Send email
(async () => {
  if (argv.verbose) {
    console.log(`✉️ Preparing to send email to ${recipientEmail}`);
    console.log(`SMTP server: ${config.smtp.host}:${config.smtp.port}`);
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: config.smtp.auth
  });

  try {
    await transporter.sendMail({
      from: config.from,
      to: recipientEmail,
      subject: subject,
      text: body
    });
    console.log(`✅ Email sent to ${recipientEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send email: ${error.message}`);
    process.exit(1);
  }
})();
