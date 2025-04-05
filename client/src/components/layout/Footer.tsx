import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground dark:bg-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-white">Wellbeing Compass</h3>
            <p className="text-muted-foreground dark:text-gray-400 text-sm">Helping you navigate your path to better wellbeing through personalized assessments and recommendations.</p>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-foreground dark:text-white">Assessments</h4>
            <ul className="space-y-2 text-muted-foreground dark:text-gray-400 text-sm">
              <li>
                <Link href="/quiz/stress">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">Stress Assessment</span>
                </Link>
              </li>
              <li>
                <Link href="/quiz/workplace">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">Workplace Wellbeing</span>
                </Link>
              </li>
              <li>
                <Link href="/quiz/digital">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">Digital Wellbeing</span>
                </Link>
              </li>
              <li>
                <Link href="/quiz/sleep">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">Sleep Quality</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-foreground dark:text-white">Resources</h4>
            <ul className="space-y-2 text-muted-foreground dark:text-gray-400 text-sm">
              <li>
                <Link href="/resources">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">Wellbeing Articles</span>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">Stress Management</span>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">Mindfulness Practices</span>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">Digital Detox Guide</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-foreground dark:text-white">Company</h4>
            <ul className="space-y-2 text-muted-foreground dark:text-gray-400 text-sm">
              <li>
                <Link href="/about">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">Contact</span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="hover:text-foreground dark:hover:text-white cursor-pointer">Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-muted dark:border-gray-700 text-center text-muted-foreground dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Wellbeing Compass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
