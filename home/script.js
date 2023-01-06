const searchInput = document.getElementById('searchInput');
const navSearch = document.getElementById('navSearch');

function search(i) {
	let query = i.value;
	if (query.trim().length != 0) {
		window.location.href = '/search/index.html?i=' + encodeURIComponent(query);
	}
}

searchInput.addEventListener('keydown', function(e) {
	if (e.key === 'Enter') {
		search(searchInput);
	}
});

navSearch.addEventListener('keydown', function(e) {
	if (e.key === 'Enter') {
		search(navSearch);
	}
});

function pop(ele){
	console.log('Pop!')
	ele.classList.add('pop')
	ele.addEventListener('animationiteration', (event) => {
		console.log('un-pop')
		ele.classList.remove('pop')
	});
}