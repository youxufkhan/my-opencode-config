// Color codes using ANSI escape sequences
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Logging functions
export function info(message: string): void {
  console.log(`${colors.blue}ℹ${colors.reset} ${message}`);
}

export function success(message: string): void {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

export function warn(message: string): void {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

export function error(message: string): void {
  console.error(`${colors.red}✗${colors.reset} ${message}`);
}

export function log(message: string): void {
  console.log(message);
}

export function dim(message: string): void {
  console.log(`${colors.dim}${message}${colors.reset}`);
}

// Step indicator
let currentStep = 0;
export function step(message: string): void {
  currentStep++;
  console.log(`${colors.cyan}▸${colors.reset} ${colors.bright}Step ${currentStep}:${colors.reset} ${message}`);
}

export function resetSteps(): void {
  currentStep = 0;
}

// Section header
export function section(title: string): void {
  console.log(`\n${colors.bright}${colors.magenta}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}${title}${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}${'='.repeat(60)}${colors.reset}\n`);
}

// Sub-section
export function subsection(title: string): void {
  console.log(`\n${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}${'-'.repeat(title.length)}${colors.reset}\n`);
}

// Table output
export function table(headers: string[], rows: string[][]): void {
  const colWidths = headers.map((h, i) => 
    Math.max(h.length, ...rows.map(r => (r[i] || '').length))
  );
  
  // Header
  console.log(
    headers.map((h, i) => `${colors.bright}${h.padEnd(colWidths[i])}${colors.reset}`).join(' | ')
  );
  console.log(colWidths.map(w => '-'.repeat(w)).join('-+-'));
  
  // Rows
  for (const row of rows) {
    console.log(
      row.map((c, i) => c.padEnd(colWidths[i])).join(' | ')
    );
  }
}

// Bullet list
export function bullet(items: string[]): void {
  for (const item of items) {
    console.log(`  ${colors.green}•${colors.reset} ${item}`);
  }
}

// Key-value pairs
export function kv(key: string, value: string): void {
  console.log(`  ${colors.dim}${key}:${colors.reset} ${value}`);
}

// Separator
export function separator(): void {
  console.log(colors.dim + '-'.repeat(60) + colors.reset);
}

// Box message
export function box(message: string, title?: string): void {
  const width = Math.min(60, message.length + 4);
  const padding = ' '.repeat(Math.floor((width - (title?.length || message.length) - 2) / 2));
  
  console.log(colors.bright + '┌' + '─'.repeat(width - 2) + '┐' + colors.reset);
  if (title) {
    console.log(colors.bright + '│' + padding + title + padding + '│' + colors.reset);
    console.log(colors.bright + '├' + '─'.repeat(width - 2) + '┤' + colors.reset);
  }
  
  const lines = message.split('\n');
  for (const line of lines) {
    console.log(colors.bright + '│' + ' ' + line.padEnd(width - 3) + '│' + colors.reset);
  }
  console.log(colors.bright + '└' + '─'.repeat(width - 2) + '┘' + colors.reset);
}
