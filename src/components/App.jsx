import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { nanoid } from 'nanoid';

import { Box } from '../components/Box';
import Form from './Form/Form';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactsList/ContactsList';
import { Title, TitleContacts } from './Title/StyledTitle';
import { NotifyFail } from '../services/notify';

const LS_KEY = 'contacts';

const App = () => {
  const [contacts, setContacts] = useLocalStorage(LS_KEY, []);

  const [filter, setFilter] = useState('');

  const addContacts = (name, number) => {
    const isNameAdded = contacts.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );
    const isNumberAdded = contacts.find(contact => contact.number === number);

    if (isNameAdded) {
      NotifyFail(`${name} is already in contacts`);
      return false;
    }
    if (isNumberAdded) {
      NotifyFail(`${number} is already in contacts`);
      return false;
    }

    setContacts(prevState => [...prevState, { id: nanoid(), name, number }]);
    return true;
  };

  const deleteContacts = id => {
    setContacts(prevState => prevState.filter(contact => contact.id !== id));
  };

  const changeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const getFilterContact = () => {
    const normalizeFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizeFilter)
    );
  };

  return (
    <Box p={[4]}>
      <Title>Phonebook</Title>
      <Form onSubmit={addContacts} />
      <TitleContacts>Contacts</TitleContacts>
      <Filter onChangeFilter={changeFilter} value={filter} />
      <>
        {contacts.length > 0 ? (
          <ContactList
            contacts={getFilterContact()}
            onDelete={deleteContacts}
          />
        ) : (
          <TitleContacts>Phonebook is empty</TitleContacts>
        )}
      </>
    </Box>
  );
};

export default App;
