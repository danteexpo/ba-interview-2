import { useState, useEffect } from 'react';
import './App.css';
import { Data, User } from './types';

enum Categories {
	gender = 'gender',
	name = 'name',
	location = 'location',
	email = 'email',
}

function App() {
	const [randomUsers, setRandomUsers] = useState<User[]>([]);
	const [query, setQuery] = useState<string>('');

	const getData = async () => {
		try {
			const res = await fetch('https://randomuser.me/api/?results=20');
			const data: Data = await res.json();
			setRandomUsers(
				data.results.map((user) => {
					return { ...user, hidden: false };
				})
			);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleSort = (header: Categories) => {
		setRandomUsers((randomUsers) =>
			[...randomUsers].sort((a, b) => {
				const nameA =
					header === Categories.gender || header === Categories.email
						? a[header].toUpperCase()
						: header === Categories.location
						? a[header].street.name.toUpperCase()
						: a[header].first.toUpperCase();
				const nameB =
					header === Categories.gender || header === Categories.email
						? b[header].toUpperCase()
						: header === Categories.location
						? b[header].street.name.toUpperCase()
						: b[header].first.toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			})
		);
	};

	useEffect(() => {
		setRandomUsers((randomUsers) =>
			randomUsers.map((user) => {
				if (!user.name.first.toLowerCase().includes(query)) {
					return { ...user, hidden: true };
				} else {
					return { ...user, hidden: false };
				}
			})
		);
	}, [query]);

	return (
		<main className="App">
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.currentTarget.value)}
				placeholder="Search for any name..."
			/>
			<table border={1}>
				<thead>
					<tr>
						<th onClick={() => handleSort(Categories.gender)}>Gender</th>
						<th onClick={() => handleSort(Categories.name)}>Name</th>
						<th onClick={() => handleSort(Categories.location)}>Location</th>
						<th onClick={() => handleSort(Categories.email)}>Email</th>
					</tr>
				</thead>
				<tbody>
					{randomUsers.length > 0 &&
						randomUsers.map((user) => (
							<tr
								key={user.email}
								style={{ display: user.hidden ? 'none' : '' }}
							>
								<td>{user.gender}</td>
								<td>
									{user.name.title} {user.name.first} {user.name.last}
								</td>
								<td>
									{user.location.street.name} {user.location.street.number},{' '}
									{user.location.city}, {user.location.country}
								</td>
								<td>{user.email}</td>
							</tr>
						))}
				</tbody>
			</table>
		</main>
	);
}

export default App;
