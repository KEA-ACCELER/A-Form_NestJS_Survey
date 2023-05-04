db.createUser({
  user: 'aformuser',
  pwd: 'aformpassword',
  roles: [
    {
      role: 'readWrite',
      db: 'aform',
    },
  ],
});
