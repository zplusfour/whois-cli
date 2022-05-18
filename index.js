#!/usr/bin/env node

import boxen from 'boxen';
import terminalLink from 'terminal-link';
import chalk from 'chalk';
import { getData } from './src/client.js';

const argv = process.argv.slice(2);

const box = (str, i) => {
	if (i === 'success') {
		console.log(boxen(chalk.green(str), { padding: 1, margin: 1, borderStyle: 'round' }));
	} else if (i === 'error') {
		console.log(boxen(chalk.red(str), { padding: 1, margin: 1, borderStyle: 'round' }));
	} else {
		console.log('uknown situation');
	}
};

if (argv[0]) {
	const usr = argv[0];
	getData(usr)
		.then((data) => {
			const d = data.userByUsername;
			if (d === null) {
				box(`User ${usr} not found`, 'error');
				process.exit(1);
			} else {
				if (!terminalLink.isSupported) {
					box(
						`${chalk.bold('@' + d.username)}#${chalk.grey(d.id)} ${d.isVerified ? '✔' : '❌'} ${
							d.firstName ? `aka ${chalk.grey(d.firstName)}` : ''
						}\nCreated on: ${chalk.grey(
							new Date(d.timeCreated).toLocaleString()
						)}\nBio: ${chalk.grey(d.bio)}`,
						'success'
					);
				} else {
					const userlink = terminalLink('@' + d.username, `https://replit.com${d.url}`);
					box(
						`${chalk.bold(userlink)}#${chalk.grey(d.id)} ${d.isVerified ? '✔' : '❌'} ${
							d.firstName ? `aka ${chalk.grey(d.firstName)}` : ''
						}\nCreated on: ${chalk.grey(
							new Date(d.timeCreated).toLocaleString()
						)}\nBio: ${chalk.grey(d.bio)}`,
						'success'
					);
				}
			}
		})
		.catch((err) => {
			console.log(err);
		});
} else {
	box(`Please provide a username`, 'error');
}