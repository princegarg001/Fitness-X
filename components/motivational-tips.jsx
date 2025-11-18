"use client"

import { useTips } from "@/components/providers/tips-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, RefreshCw, Sparkles } from "lucide-react"

export function MotivationalTips() {
  const { currentTip, loading, error, fetchRandomTip } = useTips()

  if (!currentTip && !loading) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-500" />
            Motivational Tip
          </div>
          <Button variant="ghost" size="sm" onClick={fetchRandomTip} disabled={loading} className="h-8 w-8 p-0">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <p className="text-sm text-muted-foreground italic">{error}</p>
        ) : currentTip ? (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">{currentTip.content}</p>
            </div>
            {currentTip.category && (
              <p className="text-xs text-muted-foreground capitalize">Category: {currentTip.category}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No tips available</p>
        )}
      </CardContent>
    </Card>
  )
}
