import React, { useState } from 'react';
import axios from 'axios';

const BaseURL = 'http://localhost:8000';

const CreatePostPopup = ({ isOpen, onClose, accessToken, onPostCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BaseURL}/api/post/`,
        { content },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        onPostCreated(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'black',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #0ced6a',
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
        maxWidth: '24rem',
        width: '100%'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', backgroundColor: 'black' }}>Create Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '0.25rem',
              marginBottom: '1rem',
              resize: 'none',
              boxSizing: 'border-box'
            }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="5"
            placeholder="Write your post here..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="submit" style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '0.25rem',
              border: '1px solid #0ced6a',
              cursor: 'pointer'
            }}>Create</button>
            <button type="button" onClick={onClose} style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgb(53 52 52)',
              borderRadius: '0.25rem',
              border: '1px solid #0ced6a',
              cursor: 'pointer'
            }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPopup;
