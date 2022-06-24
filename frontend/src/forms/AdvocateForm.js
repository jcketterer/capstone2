import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AdvocateForm = ({
  formTitle,
  fields,
  submitButtonText,
  processData,
  backButtonTo = '',
}) => {
  const getInitState = fields => {
    let res = {};
    for (let i = 0; i < fields.length; i++) {
      res[fields[i].name] = fields[i].initialValue;
    }
    return res;
  };

  const [formData, setFormData] = useState(getInitState(fields));

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    processData(formData);
  };

  return (
    <Row className="AdvocateForm justify-content-center">
      <Col sm={10} md={8}>
        <Card>
          <Card.Header as="h4">{formTitle}</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {fields.map(f => {
                return (
                  <Form.Group key={f.name} controlId={f.name}>
                    <Form.Label>{f.label}</Form.Label>
                    <Form.Control
                      className="my-2"
                      type={f.inputType}
                      name={f.name}
                      value={formData[f.name] || ''}
                      onChange={handleChange}
                      required={f.required}
                      placeholder={f.placeholder || ''}
                      readOnly={f.readOnly}
                      style={f.styleOverride || {}}
                      as={f.asOverride || 'input'}
                    />
                  </Form.Group>
                );
              })}
              <Button variant="primary" type="submit" className="mr-2">
                {submitButtonText}
              </Button>
              {backButtonTo !== '' ? (
                <LinkContainer to={backButtonTo}>
                  <Button variant="secondary">Back</Button>
                </LinkContainer>
              ) : null}
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AdvocateForm;
