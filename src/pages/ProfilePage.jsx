import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  EmailAuthProvider, 
  GoogleAuthProvider, 
  reauthenticateWithCredential, 
  reauthenticateWithPopup, 
  updatePassword, 
  verifyBeforeUpdateEmail 
} from 'firebase/auth';
import PageHero from '../components/PageHero';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', description: '', website: '', logoUrl: '' });
  const [editProfile, setEditProfile] = useState({ name: '', description: '', website: '', logoUrl: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;
  const isGoogleUser = user?.providerData.some((provider) => provider.providerId === 'google.com');

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setNewEmail(user.email || '');
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, 'users', user.uid, 'profile', 'data');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data);
            setEditProfile(data);
          }
        } catch (err) {
          setError('Failed to load profile: ' + err.message);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditProfile(profile);
    setNewEmail(user?.email || '');
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editProfile.name.trim()) {
      setError('Organization name is required');
      return;
    }
    if (editProfile.logoUrl && !isValidImageUrl(editProfile.logoUrl)) {
      setError('Please provide a valid image URL (e.g., ends with .png, .jpg, .jpeg, .gif, .svg, .webp)');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newEmail && !isValidEmail(newEmail)) {
      setError('Please provide a valid email address');
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Re-authenticate user
      if (newEmail !== user.email || newPassword) {
        if (isGoogleUser) {
          const provider = new GoogleAuthProvider();
          await reauthenticateWithPopup(auth.currentUser, provider);
        } else {
          if (!currentPassword) {
            setError('Current password is required to update email or password');
            setLoading(false);
            return;
          }
          const credential = EmailAuthProvider.credential(user.email, currentPassword);
          await reauthenticateWithCredential(auth.currentUser, credential);
        }
      }

      // Update email
      if (newEmail !== user.email) {
        await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
        setSuccess('Verification email sent to new address. Please verify to complete email update.');
      }

      // Update password
      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
      }

      // Update profile
      const profileData = {
        name: editProfile.name.trim(),
        description: editProfile.description.trim(),
        website: editProfile.website.trim(),
        logoUrl: editProfile.logoUrl.trim() || '',
      };

      await setDoc(doc(db, 'users', user.uid, 'profile', 'data'), profileData);
      setProfile(profileData);
      setEditProfile(profileData);
      setEmail(newEmail);
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      setIsEditing(false);
      if (!success) {
        setSuccess('Profile updated successfully');
      }
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isValidImageUrl = (url) => {
    return url.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i);
  };

  const isValidEmail = (email) => {
    return email.match(/^[^@]+@[^@]+\.[^@]+$/);
  };

  if (!user) {
    return <div className="page">Please log in to view this page.</div>;
  }

  return (
    <>
      <PageHero
        title="My Profile"
        subtitle="View and manage your organization's details for the PATHWAY Sustainability Checker."
      />
      <main className="profile-page">
        <section className="page-section page-section--white">
          <div className="page-section__inner container flex justify-center">
            <div className="card col-6">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {success && <p className="text-green-500 mb-4">{success}</p>}
              {isEditing ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="profile__field">
                    <label className="profile__label font-bold">Organization Name (Required)</label>
                    <input
                      type="text"
                      value={editProfile.name}
                      onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                      placeholder="Enter organization name"
                      className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
                      required
                    />
                  </div>
                  <div className="profile__field">
                    <label className="profile__label font-bold">Description</label>
                    <textarea
                      value={editProfile.description}
                      onChange={(e) => setEditProfile({ ...editProfile, description: e.target.value })}
                      placeholder="Enter organization description"
                      className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
                      rows="4"
                    />
                  </div>
                  <div className="profile__field">
                    <label className="profile__label font-bold">Website</label>
                    <input
                      type="url"
                      value={editProfile.website}
                      onChange={(e) => setEditProfile({ ...editProfile, website: e.target.value })}
                      placeholder="Enter website URL"
                      className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
                    />
                  </div>
                  <div className="profile__field">
                    <label className="profile__label font-bold">Logo URL (Optional)</label>
                    <input
                      type="url"
                      value={editProfile.logoUrl}
                      onChange={(e) => setEditProfile({ ...editProfile, logoUrl: e.target.value })}
                      placeholder="Enter logo image URL (e.g., https://example.com/logo.png)"
                      className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
                    />
                    <p className="text-sm text-gray-500 mb-2">
                      Provide a publicly accessible image URL. You can use services like Imgur or your website to host the logo.
                    </p>
                    {editProfile.logoUrl && (
                      <img
                        src={editProfile.logoUrl}
                        alt="Organization logo"
                        className="w-24 h-24 object-contain mt-2"
                        onError={() => setEditProfile({ ...editProfile, logoUrl: '' })}
                      />
                    )}
                  </div>
                  {!isGoogleUser && (
                    <>
                      <div className="profile__field">
                        <label className="profile__label font-bold">Current Password (Required for email/password changes)</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
                          required={newEmail !== user.email || newPassword}
                        />
                      </div>
                      <div className="profile__field">
                        <label className="profile__label font-bold">Email</label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter new email"
                          className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
                        />
                      </div>
                      <div className="profile__field">
                        <label className="profile__label font-bold">New Password (Optional)</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
                        />
                      </div>
                      <div className="profile__field">
                        <label className="profile__label font-bold">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="p-2 rounded-[1rem] mb-2 w-full border border-gray-300"
                        />
                      </div>
                    </>
                  )}
                  {isGoogleUser && (
                    <p className="text-sm text-gray-500 mb-4">
                      Email and password are managed by your Google account. Update them in your{' '}
                      <a
                        href="https://myaccount.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pathway-primary hover:text-pathway-dark"
                      >
                        Google account settings
                      </a>.
                    </p>
                  )}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="a11y-button btn--lg"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="a11y-button btn--lg"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-end">
                    <button
                      onClick={handleEdit}
                      className="a11y-button"
                      aria-label="Edit profile"
                    >
                      <svg
                        className="w-5 h-5 fill-white"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </button>
                  </div>
                  <div className="profile__field">
                    <p className="profile__label font-bold">Organization Name</p>
                    <p>{profile.name || 'Not set'}</p>
                  </div>
                  <div className="profile__field">
                    <p className="profile__label font-bold">Description</p>
                    <p>{profile.description || 'Not set'}</p>
                  </div>
                  <div className="profile__field">
                    <p className="profile__label font-bold">Website</p>
                    {profile.website ? (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pathway-primary hover:text-pathway-dark"
                      >
                        {profile.website}
                      </a>
                    ) : (
                      <p>Not set</p>
                    )}
                  </div>
                  <div className="profile__field">
                    <p className="profile__label font-bold">Logo</p>
                    {profile.logoUrl ? (
                      <img
                        src={profile.logoUrl}
                        alt="Organization logo"
                        className="w-24 h-24 object-contain"
                      />
                    ) : (
                      <p>Not set</p>
                    )}
                  </div>
                  <div className="profile__field">
                    <p className="profile__label font-bold">Email</p>
                    <p>{email || 'Not set'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProfilePage;