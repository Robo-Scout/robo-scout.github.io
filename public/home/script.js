const searchInput = document.getElementById('searchInput');
const navSearch = document.getElementById('navSearch');

function search(i) {
	let query = i.value;
	if (query.trim().length != 0) {
		window.location.href = '/search/' + encodeURIComponent(query);
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
