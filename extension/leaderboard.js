function formatTime(time, day, year) {
	if (!time) return '----';
	let start = new Date(year, 11, day);
	let seconds = time - start.getTime() / 1000 + start.getTimezoneOffset() * 60 - 18000;
	if (seconds > 86400) {
		return Math.floor(seconds / 86400) + 'd ' + Math.floor(seconds / 3600) % 24 + 'h';
	}
	
	let timeStr = '';
	if (seconds > 3600) {
		timeStr += Math.floor(seconds / 3600) + ':';
		timeStr += String(Math.floor(seconds / 60) % 60).padStart(2, '0') + ':';
	} else {
		timeStr += Math.floor(seconds / 60) % 60 + ':';
	}
	timeStr += String(seconds % 60).padStart(2, '0');
	return timeStr
}

let leaderboard;
let members;

let timeout;

function configure(members) {
	let rows = document.getElementsByClassName("privboard-row");
	if (rows.length == 0)
		return;
	let container = document.createElement('div');
	container.classList.add('injected-privboard-container');
	rows[0].parentElement.insertBefore(container, rows[0]);
	for (let row of rows) {
		row.classList.add('injected-privboard-row');
		row.parentElement.removeChild(row);
		container.appendChild(row);
	}
	
	let colSpaces = [];
	for (let i = 0; i < rows.length; i++) {
		let row = rows[i];
		
		for (let c = 0; c < row.childNodes.length; c++) {
			let child = row.childNodes[c];
			if (!(child instanceof Element) || child.tagName != 'SPAN') {
				let span = document.createElement('span');
				row.insertBefore(span, child);
				row.removeChild(child);
				span.appendChild(child);
			}
		}
		
		if (i == 0) {
			let days = row.getElementsByClassName('privboard-days')[0];
			for (let day of days.children) {
				let span = document.createElement('span');
				span.classList.add('injected-privboard-day-container');
				days.insertBefore(span, day);
				days.removeChild(day);
				span.appendChild(day);
				
				let leftSpace = document.createElement('span');
				leftSpace.classList.add('injected-privboard-space');
				leftSpace.style.setProperty('width', '0');
				leftSpace.innerHTML = ' ' + formatTime(null);
				span.prepend(leftSpace);
				
				let rightSpace = document.createElement('span');
				rightSpace.classList.add('injected-privboard-space');
				rightSpace.style.setProperty('width', '0');
				rightSpace.innerHTML = formatTime(null) + ' ';
				span.append(rightSpace);
				
				colSpaces.push([leftSpace, rightSpace]);
			}
		} else {
			let j = 0;
			for (let star of row.children) {
				if (star.className && star.className.includes('-star-')) {
					const k = j++;
					
					let leftSpace = document.createElement('span');
					leftSpace.classList.add('injected-privboard-space');
					leftSpace.style.setProperty('width', '0');
					leftSpace.innerHTML = ' ' + formatTime(null);
					star.prepend(leftSpace);
					colSpaces[k].push(leftSpace);
					
					let rightSpace = document.createElement('span');
					rightSpace.classList.add('injected-privboard-space');
					rightSpace.style.setProperty('width', '0');
					rightSpace.innerHTML = formatTime(null) + ' ';
					star.append(rightSpace);
					colSpaces[k].push(rightSpace);
					
					star.onmouseenter = function() {
						if (timeout)
							clearTimeout(timeout);
						timeout = setTimeout(function() {
							for (let i = 0; i < colSpaces.length; i++) {
								let colSpace = colSpaces[i];
								if (i == k) {
									for (let space of colSpace)
										space.style.removeProperty('width');
								} else {
									for (let space of colSpace)
										space.style.setProperty('width', '0');
								}
							}
						}, 200);
					}
					star.onmouseleave = function() {
						if (timeout)
							clearTimeout(timeout);
						timeout = setTimeout(function() {
							for (let colSpace of colSpaces)
								for (let space of colSpace)
									space.style.setProperty('width', '0');
						}, 200);
					}
				} else if (star.className && star.className == 'privboard-name' && members.has(star.innerText)) {
					let timeMap = members.get(star.innerText)['completion_day_level'];
					for (let d = 0; d < colSpaces.length; d++) {
						let dStr = String(d + 1)
						if (dStr in timeMap) {
							if ('1' in timeMap[dStr])
								colSpaces[d][i * 2].innerHTML = ' ' + formatTime(parseInt(timeMap[dStr]['1']['get_star_ts']), d + 1, parseInt(leaderboard['event']));
							if ('2' in timeMap[dStr])
								colSpaces[d][i * 2 + 1].innerHTML = formatTime(parseInt(timeMap[dStr]['2']['get_star_ts']), d + 1, parseInt(leaderboard['event'])) + ' ';
						}
					}
				}
			}
		}
	}
}

let req = new XMLHttpRequest();
req.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		leaderboard = JSON.parse(this.responseText);
		
		members = new Map();
		for (let [id, member] of Object.entries(leaderboard.members)) {
			members.set(member.name, member);
		}
		configure(members);
	}
}
req.open('GET', document.URL.replace(/(\?.+)?$/,'.json$1'));
req.send();