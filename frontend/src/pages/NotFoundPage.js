// src/pages/NotFoundPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

function NotFoundPage() {
  return (
    <Container className="text-center mt-5">
      <Alert variant="warning">
         <Alert.Heading>404 - Page Not Found</Alert.Heading>
         <p>
            Oops! The page you are looking for does not exist or may have been moved.
         </p>
         <hr />
         <div className="d-flex justify-content-center">
             <Link to="/" className="btn btn-primary">Go to Homepage</Link>
         </div>
      </Alert>
    </Container>
  );
}

export default NotFoundPage;