import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function MultiStepForm({ sessionId }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', address: '', city: '' });

    useEffect(() => {
        api.track(sessionId, 'page_view', '/form');
    }, [sessionId]);

    const handleNext = () => {
        api.track(sessionId, 'click', `next-step-${step}`);
        setStep(step + 1);
        api.track(sessionId, 'navigation', '/form', { step: step + 1 });
    };

    const handleBack = () => {
        api.track(sessionId, 'click', `back-step-${step}`);
        setStep(step - 1);
        api.track(sessionId, 'navigation', '/form', { step: step - 1 });
    };

    const handleSubmit = () => {
        api.track(sessionId, 'click', 'submit-form');
        setTimeout(() => {
            window.location.href = '/confirmation';
        }, 500);
    };

    return (
        <div className="container">
            <h1>Multi-Step Form - Step {step}</h1>
            <div className="card">
                {step === 1 && (
                    <div>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <button onClick={handleNext}>Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className="input-group">
                            <label>Address</label>
                            <input 
                                type="text" 
                                value={formData.address}
                                onChange={e => setFormData({...formData, address: e.target.value})}
                            />
                        </div>
                        <div className="btn-group">
                            <button className="secondary" onClick={handleBack}>Back</button>
                            <button onClick={handleNext}>Next</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <div className="input-group">
                            <label>City</label>
                            <input 
                                type="text" 
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                        <div className="btn-group">
                            <button className="secondary" onClick={handleBack}>Back</button>
                            <button onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
