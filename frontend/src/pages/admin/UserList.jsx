import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { User, Mail, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/api/users');
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Syncing Member Directory...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Member Directory</h1>
        <p className="text-slate-500 font-medium">Manage and monitor all registered users.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/20">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Identity</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Admin Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Verified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user, index) => (
              <motion.tr 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                key={user._id} 
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                    <Mail size={14} /> {user.email}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-center">
                    {user.isAdmin ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                        <ShieldCheck size={12} /> Administrator
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                        Member
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="flex justify-center">
                    {user.isVerified !== false ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (
                      <XCircle size={20} className="text-red-400" />
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
