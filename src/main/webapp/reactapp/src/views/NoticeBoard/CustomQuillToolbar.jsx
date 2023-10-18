import './CustomQuillToolbar.scss';
export const CustomQuillToolbar = () => (
    <div id="toolbar">
      <span className="ql-formats">
        <button className="ql-image" />
      </span>
      <span className="ql-formats">
        <select className="ql-header" defaultValue="7">
          <option value="1">Header 1</option>
          <option value="2">Header 2</option>
          <option value="3">Header 3</option>
          <option value="4">Header 4</option>
          <option value="5">Header 5</option>
          <option value="6">Header 6</option>
          <option value="7">Normal</option>
        </select>
        <select className="ql-font" defaultValue="sans-serif">
          <option value="sans-serif">Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-blockquote" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <select className="ql-align" defaultValue="right">
            <option className="ql-align-center" value="center" />
            <option className="ql-align-right" value="right" />
            <option className="ql-align-justify" value="justify" />
        </select>
      </span>
  </div>
);
export default CustomQuillToolbar;