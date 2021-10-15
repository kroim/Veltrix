import React from "react";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              © {new Date().getFullYear()} P2IC
              <span className="d-none d-sm-inline-block">
                {" "}
                - Crafted with <i className="mdi mdi-heart text-danger"></i> by
                Blue Ocean HPA.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
