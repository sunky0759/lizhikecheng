'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Users, BookOpen, LayoutDashboard } from 'lucide-react'

export default function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeModule, setActiveModule] = useState('/dashboard')
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [activeButtonPosition, setActiveButtonPosition] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const navRef = useRef<HTMLDivElement>(null)

  const handleButtonInteraction = (module: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveModule(module)
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const navRect = navRef.current?.getBoundingClientRect()
    setActiveButtonPosition({
      x: isCollapsed ? 0 : rect.left - (navRect?.left || 0),
      y: rect.top - (navRect?.top || 0),
      width: isCollapsed ? 64 : rect.width,
      height: rect.height
    })
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    document.body.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { isCollapsed: !isCollapsed } }))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const relativeX = e.clientX - navRect.left;
      const relativeY = e.clientY - navRect.top;
      requestAnimationFrame(() => {
        setHoverPosition({
          x: relativeX,
          y: relativeY,
        });
      });
    }
  };

  useEffect(() => {
    const handleMouseLeave = () => {
      setHoverPosition({ x: -100, y: -100 }) // Move shadow off-screen when mouse leaves
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      // Force re-render on window resize to update shadow position
      setHoverPosition(prev => ({ ...prev }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav 
      ref={navRef}
      onMouseMove={handleMouseMove}
      className={`bg-gray-100 min-h-screen fixed left-0 top-0 z-10 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} overflow-hidden`}
    >
      <div 
        className="fixed bg-blue-200 opacity-50 rounded-full blur-xl transition-all duration-75 pointer-events-none"
        style={{
          left: `${hoverPosition.x - 16}px`,
          top: `${hoverPosition.y - 16}px`,
          width: '32px',
          height: '32px',
          opacity: isCollapsed ? 0 : 0.5
        }}
      />
      <div 
        className="fixed bg-blue-300 opacity-50 rounded-lg pointer-events-none"
        style={{
          left: `${activeButtonPosition.x}px`,
          top: `${activeButtonPosition.y}px`,
          width: isCollapsed ? '64px' : `${activeButtonPosition.width}px`,
          height: `${activeButtonPosition.height}px`,
          opacity: isCollapsed ? 0.5 : 0.5,
          transition: 'all 0.2s ease-in-out'
        }}
      />
      <div className="flex justify-between items-center p-4 relative">
        <h1 className={`text-2xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>课程管理系统</h1>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto relative z-10">
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </Button>
      </div>
      <div className={`space-y-2 p-4 ${isCollapsed ? 'items-center' : ''}`}>
        <Button asChild variant="ghost" className={`w-full justify-start ${isCollapsed ? 'px-0' : ''} ${activeModule === '/dashboard' ? 'bg-gray-200' : ''} relative z-10 hover:bg-transparent`} onClick={(e) => handleButtonInteraction('/dashboard', e)} onMouseEnter={(e) => handleButtonInteraction('/dashboard', e)}>
          <Link href="/dashboard" className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <LayoutDashboard size={24} className={isCollapsed ? '' : 'mr-2'} />
            <span className={isCollapsed ? 'hidden' : 'block'}>数据看板</span>
            {isCollapsed && (
              <span className="sr-only">数据看板</span>
            )}
          </Link>
        </Button>
        <Button asChild variant="ghost" className={`w-full justify-start ${isCollapsed ? 'px-0' : ''} ${activeModule === '/teachers' && !isCollapsed ? 'bg-gray-200' : ''} relative z-10 hover:bg-transparent`} onClick={(e) => handleButtonInteraction('/teachers', e)} onMouseEnter={(e) => handleButtonInteraction('/teachers', e)}>
          <Link href="/teachers" className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <Users size={24} className={isCollapsed ? '' : 'mr-2'} />
            <span className={isCollapsed ? 'hidden' : 'block'}>老师管理</span>
            {isCollapsed && (
              <span className="sr-only">老师管理</span>
            )}
          </Link>
        </Button>
        <Button asChild variant="ghost" className={`w-full justify-start ${isCollapsed ? 'px-0' : ''} ${activeModule === '/courses' && !isCollapsed ? 'bg-gray-200' : ''} relative z-10 hover:bg-transparent`} onClick={(e) => handleButtonInteraction('/courses', e)} onMouseEnter={(e) => handleButtonInteraction('/courses', e)}>
          <Link href="/courses" className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <BookOpen size={24} className={isCollapsed ? '' : 'mr-2'} />
            <span className={isCollapsed ? 'hidden' : 'block'}>课程管理</span>
            {isCollapsed && (
              <span className="sr-only">课程管理</span>
            )}
          </Link>
        </Button>
      </div>
    </nav>
  )
}

