import React from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { LogOut, Crown, Sparkles, Zap } from "lucide-react";

export default function AppLayout({ children }) {
    const onLogout = () => {
        router.get("/auth/logout");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20">
            {/* Navigation */}
            <nav className="border-b border-gray-300/30 bg-white/80 backdrop-blur-xl shadow-2xl">
                <div className="container mx-auto px-4">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/" 
                                className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3"
                            >
                                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl">
                                    <Crown className="h-6 w-6 text-white" />
                                </div>
                                Daniel Todos
                                <Sparkles className="h-5 w-5 text-yellow-500" />
                            </Link>
                        </div>
                        
                        {/* Premium Logout Button */}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={onLogout}
                            className="relative overflow-hidden group bg-gradient-to-br from-white to-gray-50/90 border-2 border-red-300/60 hover:border-red-400/80 text-red-600 hover:text-red-700 font-bold rounded-2xl px-6 py-3 shadow-2xl hover:shadow-3xl transition-all duration-500 backdrop-blur-sm hover:scale-105 min-w-[140px] h-12"
                        >
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/8 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Sparkle Effects */}
                            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Sparkles className="w-3 h-3 text-red-500 animate-pulse" />
                            </div>
                            <div className="absolute -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                                <Zap className="w-3 h-3 text-pink-500 animate-bounce" />
                            </div>
                            
                            {/* Shine Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            
                            {/* Animated Gradient Border */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                                <div className="absolute inset-[2px] rounded-2xl bg-white/95 backdrop-blur-sm"></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex items-center gap-3">
                                <div className="relative">
                                    <LogOut className="w-5 h-5 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
                                    <div className="absolute inset-0 bg-red-500 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                </div>
                                <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent font-black text-sm tracking-wider drop-shadow-sm">
                                    Logouts
                                </span>
                            </div>

                            {/* Pulse Ring Effect */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-red-400/20 group-hover:border-red-400/40 group-hover:animate-pulse transition-all duration-300 -z-10"></div>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10">{children}</main>

            {/* Footer */}
            <footer className="border-t border-gray-300/30 bg-white/80 backdrop-blur-xl py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
                        <div className="text-lg font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            &copy; 2025 Zero To Hero
                        </div>
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm text-gray-600/80 font-medium">
                        Built with ❤️ for maximum productivity
                    </p>
                </div>
            </footer>

            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        </div>
    );
}