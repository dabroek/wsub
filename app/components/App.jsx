import React from 'react';
import Promise from 'bluebird';
import Dropzone from 'react-dropzone';

import Spinner from './Spinner';

import {
  addic7ed,
  opensubtitles,
  subscene
} from '../sources';

const LANG = 'en';

class App extends React.Component {

  state = {
    files: [],
  };

  setFileAsLoaded(i, success) {
    this.setState({
      files: [
        ...this.state.files.slice(0, i),
        Object.assign({}, this.state.files[i], {loading: false, success}),
        ...this.state.files.slice(i + 1),
      ],
    });
  }

  onDrop(files) {
    this.setState({
      'files': [
        ...this.state.files, 
        ...files.map(file => ({
          name: file.name,
          path: file.path,
          size: file.size,
          started: false,
          loading: true,
          success: undefined,
        })),
      ],
    });

    files.forEach((file, i) => {
      const s1 = addic7ed.search(file, LANG);
      const s2 = opensubtitles.search(file, LANG);
      const s3 = subscene.search(file, LANG);
      
      Promise.any([s1, s2, s3])
        .then(({ subtitles, source }) => {
          switch (source) {
            case 'addic7ed':
              console.log('Downloading from addic7ed...');
              return addic7ed.download(subtitles[0].url, file.path);
            case 'opensubtitles':
              console.log('Downloading from opensubtitles...')
              return opensubtitles.download(subtitles[LANG].url, file.path);
            case 'subscene':
              console.log('Downloading from subscene...');
              return subscene.download(subtitles.url, file.path);
            default:
              throw new Error('No subtitle downloaded.');
          }
        })
        .then(msg => {
          console.log(msg);
          this.setFileAsLoaded(i, true);
        })
        .catch(err => {
          console.error(err);
          this.setFileAsLoaded(i, false);
        })
    })
  }

  renderResults() {
    return this.state.files.map((file, i) => (
      <div key={i} className="results__item">
        <span>{file.name}</span>
        <span>
          {(file.loading
            ? <Spinner color="white" config={{lines: 7, width: 2, radius: 2, length: 2}}/> 
            : (file.success ? <span className="success">&#10003;</span> : <span className="failure">&#10007;</span>)
          )}
        </span>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <div className="header">wsub</div>
        <Dropzone
          className="box vp-size flex-center" 
          activeClassName="active" 
          disableClick={true}
          onDrop={this.onDrop.bind(this)}
        >
          <div className="text-center">
            {
              !this.state.files.length && 
              <div>
                <svg 
                  className="box__icon m-b-sm" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="50" height="43" 
                  viewBox="0 0 50 43"
                >
                  <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path>
                </svg>
                <p>Drop your files here!</p>
              </div>
            }
          </div>
        </Dropzone>
        <div className="results">
          {this.renderResults()}
        </div>
      </div>
    );
  }
}

export default App;
