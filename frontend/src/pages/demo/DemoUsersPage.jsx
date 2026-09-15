import React from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiUserCheck, FiUser, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const DemoUsersPage = () => {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSwitchUser = (roleKey) => {
    loginAsDemo(roleKey);
    navigate('/');
  };

  const roleCards = [
    {
      key: 'ADMIN',
      title: 'Administrator',
      icon: <FiShield className="w-8 h-8 text-blue-600" />,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      account: DEMO_ACCOUNTS.ADMIN,
      permissions: [
        'Full executive dashboard with business analytics',
        'Customer onboarding and profile management',
        'Create, renew, and cancel insurance policies',
        'Review, approve, and reject claim requests',
        'Record & track premium payments',
        'Generate and download Monthly Business PDF Reports',
        'Manage documents & compliance files'
      ]
    },
    {
      key: 'AGENT',
      title: 'Insurance Agent',
      icon: <FiUserCheck className="w-8 h-8 text-purple-600" />,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      account: DEMO_ACCOUNTS.AGENT,
      permissions: [
        'Customer consultation & profile updates',
        'Issue new policies for customers',
        'Review policy renewal eligibility',
        'Assess and forward claim requests',
        'Assist customers with document uploads',
        'Inspect payment status and histories'
      ]
    },
    {
      key: 'CUSTOMER',
      title: 'Policyholder / Customer',
      icon: <FiUser className="w-8 h-8 text-emerald-600" />,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      account: DEMO_ACCOUNTS.CUSTOMER,
      permissions: [
        'Personal insurance portfolio overview',
        'Submit new incident claim applications',
        'Track real-time claim status (Submitted → Approved)',
        'Upload claim incident proofs (PDF, JPG, PNG)',
        'View payment receipts & premium schedules'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Demo User Accounts & Roles</h1>
            <p className="text-sm text-gray-500 mt-1">
              Explore and test the Insurance Management Platform under different Role-Based Access Control (RBAC) personas.
            </p>
          </div>
          {user && (
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 text-sm">
              <span className="text-gray-500">Currently active:</span>
              <span className="font-semibold text-gray-800">{user.email}</span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                {user.role?.replace('ROLE_', '')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roleCards.map((card) => {
          const isCurrent = user?.email?.toLowerCase() === card.account.email.toLowerCase();

          return (
            <div
              key={card.key}
              className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between transition-all duration-200 ${
                isCurrent ? 'ring-2 ring-blue-500 border-transparent shadow-md' : 'border-gray-200 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">{card.icon}</div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${card.badgeColor}`}>
                    {card.account.role.replace('ROLE_', '')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
                <p className="text-xs text-gray-500 mb-4">{card.account.name}</p>

                {/* Credentials Box */}
                <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1.5 border border-gray-100 font-mono mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-gray-800 font-medium select-all">{card.account.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Password:</span>
                    <span className="text-gray-800 font-medium select-all">{card.account.password}</span>
                  </div>
                </div>

                {/* Permissions List */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Role Capabilities:</h4>
                  <ul className="space-y-1.5">
                    {card.permissions.map((perm, idx) => (
                      <li key={idx} className="flex items-start text-xs text-gray-600">
                        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-gray-100">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-700 font-medium rounded-lg text-sm flex items-center justify-center space-x-1 cursor-default"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Active Session</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSwitchUser(card.key)}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm flex items-center justify-center space-x-2 transition shadow-sm"
                  >
                    <span>Switch to {card.title}</span>
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* RBAC Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Role-Based Access Control (RBAC) Matrix</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Module / Feature</th>
                <th className="px-4 py-3 text-center font-semibold text-blue-600">Admin</th>
                <th className="px-4 py-3 text-center font-semibold text-purple-600">Agent</th>
                <th className="px-4 py-3 text-center font-semibold text-emerald-600">Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              <tr>
                <td className="px-4 py-2.5 text-gray-800">Analytics & Business Reports Dashboard</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Full Access</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Full Access</td>
                <td className="px-4 py-2.5 text-center text-gray-400">❌ Restricted</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-gray-800">Customer Records & Policy History</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Create / Read / Edit</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Create / Read / Edit</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ View Own Profile</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-gray-800">Policy Management (Issue & Renew)</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Full Control</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Issue & Renew</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ View Own Policies</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-gray-800">Claim Adjudication (Approve / Reject)</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Approve / Reject</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Review & Verify</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Submit & Track</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-gray-800">Premium Payments Processing</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Record & View All</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Record & View All</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ View Own Payments</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-gray-800">PDF Report Generation (OpenPDF)</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Monthly Reports</td>
                <td className="px-4 py-2.5 text-center text-emerald-600">✅ Monthly Reports</td>
                <td className="px-4 py-2.5 text-center text-gray-400">❌ Restricted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DemoUsersPage;
