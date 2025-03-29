

import React, { Component } from 'react';
import './App.css';
import html2canvas from 'html2canvas';

class UgadiGreeting extends Component {
  state = {
    name: "",
    festival: "",
    customMessage: "",
    card: null,
    history: JSON.parse(localStorage.getItem('greetingHistory')) || [],
    step: 1,
    showForm: true,
  };

  generateGreeting = (name, festival, customMessage) => {
    const greetings = {
      ugadi: 'Enjoy the festival with joy!',
      ramadan: 'May this festival bring happiness!',
    };

    const title =
      festival === 'ugadi'
        ? `Happy Ugadi, ${name}!`
        : `Ramadan Mubarak, ${name}!`;
    const message = greetings[festival];
    const theme = festival === 'ugadi' ? 'ugadi-card' : 'ramadan-card';
    const custommsg = customMessage ? ` ${customMessage}` : '';

    return { title, message, theme, custommsg };
  };

  handleNext = () => {
    const { name, festival, step } = this.state;

    if (step === 1) {
      if (name.trim() === "") {
        alert("Please enter your name.");
        return;
      }
      this.setState({ step: 2 });
    } else if (step === 2) {
      if (!festival) {
        alert("Please select a festival.");
        return;
      }
      this.setState({ step: 3 });
    }
  };

  handleBack = () => {
    this.setState(prevState => ({ step: prevState.step - 1 }));
  };

  handleSubmit = () => {
    const { name, festival, customMessage, history } = this.state;
    const trimmedName = name.trim() === "" ? "Friend" : name.trim();

    const greeting = this.generateGreeting(trimmedName, festival, customMessage);
    const card = {
      title: greeting.title,
      message: greeting.message,
      theme: greeting.theme,
      custommsg: greeting.custommsg
    };

    this.setState(
      {
        card,
        history: [
          `${greeting.title} - ${greeting.message} ${greeting.custommsg}`,
          ...history
        ].slice(0, 3), // Keep only the last 3 greetings
        showForm: false
      },
      () => {
        // Save the updated history to localStorage
        localStorage.setItem('greetingHistory', JSON.stringify(this.state.history));
      }
    );
  };

  handleDownload = () => {
    const { card } = this.state;

    if (this.cardRef) {
      this.cardRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.cardRef.style.animation = 'none';

      html2canvas(this.cardRef, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: null,
        width: this.cardRef.scrollWidth,
        height: this.cardRef.scrollHeight,
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${card.title}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        this.cardRef.style.animation = 'cardAppear 0.5s ease-in';
      });
    }
  };

  handleCreateNewCard = () => {
    this.setState({
      name: "",
      festival: "",
      customMessage: "",
      card: null,
      step: 1,
      showForm: true,
    });
  };

  handleClearHistory = () => {
    this.setState({ history: [] }, () => {
      localStorage.removeItem('greetingHistory');
    });
  };

  render() {
    const { name, festival, customMessage, card, history, step, showForm } = this.state;

    const headingColor = festival === 'ugadi' ? 'white' : 'gold';
    const paraColor = festival === 'ugadi' ? 'white' : 'gold';

    return (
      <div className="body">
        <div className="container">
          <h1>Festival Greeting Generator</h1>

          {showForm && (
            <form id="greetingForm">
              {step === 1 && (
                <div className="form-group">
                  <label htmlFor="name">Step 1: Your Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => this.setState({ name: e.target.value })}
                    required
                  />
                  <div className="button-group">
                    <button type="button" onClick={this.handleNext}>
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-group">
                  <label htmlFor="festival">Step 2: Choose Festival</label>
                  <select
                    id="festival"
                    value={festival}
                    onChange={e => this.setState({ festival: e.target.value })}
                    required
                  >
                    <option value="" disabled>
                      Select a festival
                    </option>
                    <option value="ugadi">Ugadi</option>
                    <option value="ramadan">Ramadan</option>
                  </select>
                  <div className="button-group">
                    <button type="button" onClick={this.handleBack}>
                      Back
                    </button>
                    <button type="button" onClick={this.handleNext}>
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-group">
                  <label htmlFor="customMessage">
                    Step 3: Custom Message (max 20 characters)
                  </label>
                  <input
                    type="text"
                    id="customMessage"
                    placeholder="E.g., Stay blessed!"
                    value={customMessage}
                    onChange={e => this.setState({ customMessage: e.target.value })}
                    maxLength="20"
                  />
                  <div className="button-group">
                    <button type="button" onClick={this.handleBack}>
                      Back
                    </button>
                    <button type="button" onClick={this.handleSubmit}>
                      Generate Greeting Card
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {card && (
            <>
              <div
                id="greeting-card"
                className={card.theme}
                ref={ref => (this.cardRef = ref)}
              >
                <div className="text-container">
                  <h2 className="name" style={{ color: headingColor }}>
                    {card.title}
                  </h2>
                  <p style={{ color: paraColor }}>{card.message}</p>
                  <p className="para" style={{ color: paraColor }}>
                    {card.custommsg}
                  </p>
                </div>
              </div>
              <div className="button-group">
                <button
                  type="button"
                  onClick={this.handleDownload}
                  className="download-btn"
                >
                  Download Card
                </button>
                <button
                  type="button"
                  onClick={this.handleCreateNewCard}
                  className="new-card-btn"
                >
                  Create New Card
                </button>
              </div>
            </>
          )}

          {history.length > 0 && (
            <div id="history">
              <div className="history-header">
                <h3>Previous Greetings</h3>
                <button
                  type="button"
                  onClick={this.handleClearHistory}
                  className="clear-btn"
                >
                  Clear All
                </button>
              </div>
              <ul>
                {history.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default UgadiGreeting;
