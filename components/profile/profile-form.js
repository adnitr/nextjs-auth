import { useState } from 'react';
import classes from './profile-form.module.css';

function ProfileForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      oldPassword.trim() === '' ||
      oldPassword.length < 7 ||
      newPassword.trim() === '' ||
      newPassword.length < 7
    ) {
      alert('Enter valid old and new passwords. (Length must be atleast 7)');
      return;
    }

    //send request
    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Something went wrong!');
      return;
    }

    alert(data.message);
    setNewPassword('');
    setOldPassword('');
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input
          type='password'
          id='new-password'
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
          required
        />
      </div>
      <div className={classes.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input
          type='password'
          id='old-password'
          value={oldPassword}
          onChange={(e) => {
            setOldPassword(e.target.value);
          }}
          required
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
