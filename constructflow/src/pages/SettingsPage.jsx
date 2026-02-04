import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function SettingsPage() {
  return (
    <div className="dashboard">
      <Sidebar role="manager" />
      <div className="dashboard-content">
        <Header title="Settings" role="manager" />

        <div className="dashboard-main">
          <div className="section">
            <h2>Account Settings</h2>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Email Notifications</h4>
                  <p>Receive email updates about project changes</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Task Reminders</h4>
                  <p>Get reminders about upcoming deadlines</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Project Settings</h2>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Default Project Duration</h4>
                  <p>Set default timeline for new projects</p>
                </div>
                <select className="setting-select">
                  <option>2 weeks</option>
                  <option>1 month</option>
                  <option>3 months</option>
                  <option>6 months</option>
                </select>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Auto-archive completed projects</h4>
                  <p>Automatically move completed projects to archive</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Danger Zone</h2>
            <div className="settings-group danger">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account and all data</p>
                </div>
                <button className="btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
